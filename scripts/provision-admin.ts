import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log('--- Sunward Admin Provisioning ---');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const email = await question('Admin Email: ');
  const password = await question('Admin Password: ');
  const displayName = await question('Display Name: ');

  console.log('\nCreating user in Supabase Auth...');
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    console.error('Failed to create Supabase user:', authError.message);
    process.exit(1);
  }

  const authUserId = authData.user.id;
  console.log("Supabase User created: " + authUserId);

  console.log('Creating AdminUser record in Database...');
  
  try {
    const adminUser = await prisma.adminUser.create({
      data: {
        authUserId,
        email,
        displayName,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('AdminUser created successfully:', adminUser.id);
    console.log('Provisioning Complete. You may now log in at /admin/login');
  } catch (error) {
    console.error('Failed to create AdminUser in database:', error);
    // Cleanup supabase user on fail
    await supabase.auth.admin.deleteUser(authUserId);
    console.log('Rolled back Supabase Auth user.');
  } finally {
    await prisma.`$disconnect();
    rl.close();
  }
}

main().catch(console.error);

