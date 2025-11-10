export async function GET(request) {
  return new Response('GET users');
}

export async function POST(request) {
  return new Response('Create user');
}

export async function PUT(request) {
  return new Response('Update user');
}

export async function DELETE(request) {
  return new Response('Delete user');
}

export async function PATCH(request) {
  return new Response('Patch user');
} 