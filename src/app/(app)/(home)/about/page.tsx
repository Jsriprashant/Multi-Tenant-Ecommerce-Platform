export default function About() {
  return (
    <div className="prose max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About This Project</h1>

      <p>
        This is a real <strong>multi-tenant e-commerce application</strong> where
        creators can have their own storefronts, sell digital products, and get
        paid through <strong>Stripe Connect</strong>. It’s designed to feel like
        a modern SaaS platform, with features you’d expect from production-grade
        apps.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">Key Features</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Multi-tenant architecture with subdomains for each creator</li>
        <li>Storefronts to showcase and sell digital products</li>
        <li>Stripe Connect integration for payouts and platform fees</li>
        <li>Product reviews and ratings</li>
        <li>Automatic file delivery & personal product libraries</li>
        <li>Role-based admin dashboard with access control</li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">Technology Stack</h2>
      <p>
        Built using the latest technologies for performance and scalability:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Next.js 15</strong> — modern React framework with App Router</li>
        <li><strong>Payload CMS</strong> — backend for data, auth, and file management</li>
        <li><strong>Stripe</strong> — payments and payouts through Connect</li>
        <li><strong>tRPC</strong> — end-to-end typesafe API calls</li>
        <li><strong>MongoDB</strong> — database for tenants, products, and orders</li>
        <li><strong>Tailwind CSS</strong> + shadcn/ui for styling and components</li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">Why This Project?</h2>
      <p>
        The goal of this project is to get a practical, full-stack learning
        experience. See how real platforms like Gumroad, Kajabi, or
        Podia are structured under the hood — from handling multiple tenants and
        permissions to delivering digital content securely and managing
        payments.
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">What I Have Learned</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>How to build scalable multi-tenant systems</li>
        <li>How to integrate and manage Stripe Connect</li>
        <li>How to structure an app with Payload CMS + Next.js</li>
        <li>How to implement role-based access control (RBAC)</li>
        <li>How to ship production-ready SaaS features</li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold">Future Enhancements</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Buy a domain so subdomains work seamlessly in production</li>
        <li>Add an employee layer to review posts, images, and products created by tenants</li>
        <li>Implement a load balancer for better scalability</li>
        <li>Improve website accessibility for smoother user navigation</li>
        <li>Extend support from digital products to physical goods with options like quantity, size, and color</li>
      </ul>
    </div>
  )
}
