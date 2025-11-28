// src/app/api/webhooks/clerk/route.ts
// Webhook Clerk pour synchroniser Users et Organizations avec Supabase

import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Récupérer le webhook secret depuis les variables d'environnement
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not defined')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  // Récupérer les headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // Vérifier que tous les headers sont présents
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers')
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  // Récupérer le body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Créer une nouvelle instance Svix avec le secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Vérifier la signature du webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Traiter les différents types d'événements
  const eventType = evt.type

  try {
    switch (eventType) {
      // ========================================
      // ORGANIZATION EVENTS
      // ========================================
      case 'organization.created': {
        const { id, name, slug } = evt.data
        
        console.log('📦 Creating organization:', { id, name, slug })
        
        await prisma.organization.create({
          data: {
            id: id,
            name: name,
            slug: slug || id,
          },
        })
        
        console.log('✅ Organization created successfully')
        break
      }

      case 'organization.updated': {
        const { id, name, slug } = evt.data
        
        console.log('📦 Updating organization:', { id, name, slug })
        
        await prisma.organization.update({
          where: { id: id },
          data: {
            name: name,
            slug: slug || id,
          },
        })
        
        console.log('✅ Organization updated successfully')
        break
      }

      case 'organization.deleted': {
        const { id } = evt.data
        
        console.log('📦 Deleting organization:', { id })
        
        await prisma.organization.delete({
          where: { id: id },
        })
        
        console.log('✅ Organization deleted successfully')
        break
      }

      // ========================================
      // USER EVENTS
      // ========================================
      case 'user.created': {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data
        
        const email = email_addresses[0]?.email_address || ''
        const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User'
        
        console.log('👤 Creating user:', { id, email, name })
        
        // Note: L'utilisateur sera lié à une organisation via organizationMembership.created
        // Pour l'instant, on ne peut pas créer l'utilisateur sans organizationId
        // On attendra l'événement organizationMembership.created
        
        console.log('⏳ User creation deferred until organization membership')
        break
      }

      // ========================================
      // ORGANIZATION MEMBERSHIP EVENTS
      // ========================================
      case 'organizationMembership.created': {
        const { organization, public_user_data, role } = evt.data
        
        const orgId = organization.id
        const userId = public_user_data.user_id
        const email = public_user_data.identifier || ''
        const name = `${public_user_data.first_name || ''} ${public_user_data.last_name || ''}`.trim() || 'User'
        const avatarUrl = public_user_data.image_url || null
        
        // Déterminer le rôle
        let userRole: 'OWNER' | 'ADMIN' | 'MEMBER' = 'MEMBER'
        if (role === 'org:admin') userRole = 'ADMIN'
        if (role === 'org:owner') userRole = 'OWNER'
        
        console.log('🔗 Creating user membership:', { 
          userId, 
          orgId, 
          email, 
          name, 
          role: userRole 
        })
        
        // Créer ou mettre à jour l'utilisateur
        await prisma.user.upsert({
          where: { clerkId: userId },
          create: {
            clerkId: userId,
            email: email,
            name: name,
            avatarUrl: avatarUrl,
            role: userRole,
            organizationId: orgId,
          },
          update: {
            email: email,
            name: name,
            avatarUrl: avatarUrl,
            role: userRole,
            organizationId: orgId,
          },
        })
        
        console.log('✅ User membership created successfully')
        break
      }

      case 'organizationMembership.deleted': {
        const { public_user_data } = evt.data
        const userId = public_user_data.user_id
        
        console.log('🔗 Deleting user membership:', { userId })
        
        // Supprimer l'utilisateur de la base de données
        await prisma.user.delete({
          where: { clerkId: userId },
        })
        
        console.log('✅ User membership deleted successfully')
        break
      }

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(`❌ Error processing webhook event ${eventType}:`, error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

