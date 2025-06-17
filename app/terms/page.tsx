import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import Navbar from "@/components/common/navbar"
import Footer from "@/components/common/footer"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Global Saanvika',
  description: 'Read the terms and conditions for Global Saanvika e-commerce platform. Learn about our policies on orders, payments, shipping, returns, and user conduct.',
  keywords: 'terms and conditions, Global Saanvika, e-commerce policy, user agreement, legal terms',
  robots: 'index, follow',
  openGraph: {
    title: 'Terms and Conditions | Global Saanvika',
    description: 'Read the terms and conditions for Global Saanvika e-commerce platform.',
    type: 'website',
  }
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gold-500 hover:text-gold-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="prose prose-gray max-w-none">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
            
            <div className="mb-8 p-6 bg-muted/30 rounded-lg border-l-4 border-gold-500">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Last Updated:</strong> June 17, 2025
              </p>
              <p className="text-sm text-muted-foreground">
                Please read these Terms and Conditions carefully before using our services. By accessing or using our website, you agree to be bound by these terms.
              </p>
            </div>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="mb-3">
                  By accessing and using Global Saanvika's website ("the Website"), mobile application, or any of our services, you accept and agree to be bound by the terms and provisions of this agreement ("Terms"). If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and Global Saanvika. We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Products and Services</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.1 Product Offerings</h3>
                <p className="mb-3">
                  Global Saanvika specializes in premium jewelry, artistic photo frames, resin art, and handcrafted decorative items. All products are carefully curated and represent authentic craftsmanship.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.2 Product Information</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Product descriptions, specifications, and images are provided for informational purposes</li>
                  <li>Colors may vary slightly due to monitor settings and photography lighting</li>
                  <li>Dimensions and weights are approximate and may vary within acceptable tolerances</li>
                  <li>All products are subject to availability and may be discontinued without notice</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.3 Pricing</h3>
                <p>
                  All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. Prices are subject to change without prior notice. Any price changes will not affect orders already placed and confirmed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration and Security</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.1 Account Creation</h3>
                <p className="mb-3">
                  To place orders, you must create an account and provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.2 Account Security</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Use a strong, unique password for your account</li>
                  <li>We reserve the right to suspend accounts for security reasons</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Orders and Payment</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.1 Order Process</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>All orders are subject to acceptance and inventory availability</li>
                  <li>We reserve the right to refuse or cancel any order at our discretion</li>
                  <li>Order confirmation does not guarantee product availability</li>
                  <li>We will notify you if any items are unavailable or backordered</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.2 Payment Terms</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Payment must be made in full before shipment</li>
                  <li>We accept credit cards, debit cards, UPI, and other digital payment methods</li>
                  <li>All transactions are processed securely through Razorpay</li>
                  <li>We do not store your payment information on our servers</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.3 Order Modifications</h3>
                <p>
                  Orders can be modified or cancelled within 2 hours of placement, subject to processing status. Once an order enters processing, modifications may not be possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Shipping and Delivery</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">5.1 Shipping Areas</h3>
                <p className="mb-3">
                  We ship across India and to select international locations. Shipping costs and delivery times vary by location and shipping method selected.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">5.2 Delivery Timeframes</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Standard delivery: 5-7 business days within India</li>
                  <li>Express delivery: 2-3 business days (available in major cities)</li>
                  <li>International shipping: 10-15 business days</li>
                  <li>Custom/made-to-order items: 15-21 business days</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">5.3 Shipping Responsibility</h3>
                <p>
                  Risk of loss and title for products pass to you upon delivery to the shipping carrier. We are not responsible for delays caused by shipping carriers, customs, or unforeseen circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Returns and Refunds</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.1 Return Policy</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Returns accepted within 30 days of delivery</li>
                  <li>Items must be unused and in original packaging</li>
                  <li>Custom or personalized items are not returnable</li>
                  <li>Customer bears return shipping costs unless item is defective</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.2 Refund Process</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Refunds processed within 5-7 business days after return receipt</li>
                  <li>Refunds issued to original payment method</li>
                  <li>Shipping charges are non-refundable unless item is defective</li>
                  <li>Processing fees may apply for certain payment methods</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">6.3 Exchanges</h3>
                <p>
                  We offer exchanges for size or color variations subject to availability. Exchange requests must be made within 15 days of delivery.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
                <p className="mb-3">
                  All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Global Saanvika and is protected by copyright and trademark laws.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">7.1 Permitted Use</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Personal, non-commercial use of website content</li>
                  <li>Sharing product images for social media with proper attribution</li>
                  <li>Downloading order confirmations and receipts</li>
                </ul>
                <h3 className="text-lg font-semibold text-foreground mb-2">7.2 Prohibited Use</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Commercial use of our content without permission</li>
                  <li>Reproducing or distributing our designs</li>
                  <li>Reverse engineering or copying our website functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. User Conduct</h2>
                <p className="mb-3">By using our services, you agree not to:</p>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Post inappropriate content in reviews or comments</li>
                  <li>Use our platform for fraudulent activities</li>
                  <li>Interfere with the proper functioning of our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Privacy and Data Protection</h2>
                <p className="mb-3">
                  Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link href="/privacy" className="text-gold-500 hover:text-gold-600 underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">9.1 Data Collection</h3>
                <p className="mb-3">We collect information necessary to provide our services, process orders, and improve user experience.</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">9.2 Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
                <p className="mb-3">
                  To the fullest extent permitted by law, Global Saanvika shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">10.1 Maximum Liability</h3>
                <p className="mb-3">
                  Our total liability for any claims arising from your use of our services shall not exceed the amount you paid for the specific product or service in question.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">10.2 Force Majeure</h3>
                <p>
                  We are not liable for delays or failures in performance resulting from acts beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, or government actions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Dispute Resolution</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">11.1 Governing Law</h3>
                <p className="mb-3">
                  These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">11.2 Dispute Process</h3>
                <ul className="list-disc ml-6 mb-3 space-y-1">
                  <li>First, contact our customer service team to resolve issues amicably</li>
                  <li>If unresolved, disputes may be subject to binding arbitration</li>
                  <li>Class action lawsuits are not permitted under these Terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
                <p className="mb-3">
                  We reserve the right to terminate or suspend your account and access to our services at any time, with or without notice, for any reason, including violation of these Terms.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">12.1 Effect of Termination</h3>
                <p>
                  Upon termination, your right to use our services ceases immediately. Provisions regarding intellectual property, limitation of liability, and dispute resolution shall survive termination.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
                <div className="bg-muted/30 p-6 rounded-lg">
                  <p className="mb-3">For questions about these Terms and Conditions, please contact us:</p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> <a href="mailto:legal@globalsaanvika.com" className="text-gold-500 hover:text-gold-600">legal@globalsaanvika.com</a></p>
                    <p><strong>Customer Service:</strong> <a href="mailto:support@globalsaanvika.com" className="text-gold-500 hover:text-gold-600">support@globalsaanvika.com</a></p>
                    <p><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                    <p><strong>Address:</strong> Global Saanvika, Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">14. Miscellaneous</h2>
                <h3 className="text-lg font-semibold text-foreground mb-2">14.1 Severability</h3>
                <p className="mb-3">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">14.2 Entire Agreement</h3>
                <p className="mb-3">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and Global Saanvika regarding the use of our services.
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2">14.3 Waiver</h3>
                <p>
                  No waiver of any term or condition shall be deemed a further or continuing waiver of such term or any other term.
                </p>
              </section>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Additional Resources
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• <Link href="/privacy" className="text-gold-500 hover:text-gold-600 underline">Privacy Policy</Link></p>
                    <p>• <Link href="/contact" className="text-gold-500 hover:text-gold-600 underline">Contact Support</Link></p>
                    <p>• <Link href="/faq" className="text-gold-500 hover:text-gold-600 underline">Frequently Asked Questions</Link></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gold-50 dark:bg-gold-900/20 rounded-lg border border-gold-200 dark:border-gold-800">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> June 17, 2025<br />
                <strong>Version:</strong> 2.0<br />
                <strong>Effective Date:</strong> June 17, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

