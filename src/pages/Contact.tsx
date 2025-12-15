import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, HelpCircle, Handshake, Calendar, MapPin, Linkedin, Twitter } from 'lucide-react';
import SEO from '@/components/SEO';
import Navigation from '@/components/marketing/Navigation';
import Footer from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Hero } from '@/components/marketing/sections/Hero';
import { generateContactPageSchema, generateOrganizationSchema, generateBreadcrumbSchema, generateLocalBusinessSchema } from '@/lib/schema';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  userType: z.enum(['buyer', 'supplier', 'partner', 'other']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  joinWaitlist: z.boolean(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      userType: 'buyer',
      subject: '',
      message: '',
      joinWaitlist: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      if (!supabase) {
        throw new Error('Contact service is not configured. Please try again later.');
      }

      const { data: result, error } = await supabase.functions.invoke('submit-contact-form', {
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          company: data.company || null,
          userType: data.userType,
          subject: data.subject,
          message: data.message,
          joinWaitlist: data.joinWaitlist,
        },
      });

      if (error) {
        throw error;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to submit form');
      }
      
      toast({
        title: "Message sent!",
        description: "We've received your message and will be in touch soon.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactPageSchema = generateContactPageSchema();
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema({
    email: 'info@holescale.com',
    addressLocality: 'Colorado',
    addressRegion: 'CO',
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://holescale.com/" },
    { name: "Contact", url: "https://holescale.com/contact" },
  ]);

  return (
    <>
      <SEO
        title="Contact HoleScale | Get in Touch With Our Team"
        description="Have questions about HoleScale? Contact our team for support, partnership inquiries, or to schedule a demo. We're here to help."
        canonical="https://holescale.com/contact"
        keywords="contact HoleScale, packaging marketplace support, B2B inquiries, schedule demo"
        schema={[contactPageSchema, organizationSchema, localBusinessSchema, breadcrumbSchema]}
      />

      <Navigation />

      {/* Hero */}
      <Hero
        headline="Contact Us"
        subheadline="Have a question or want to learn more? We'd love to hear from you."
        variant="centered"
      />

      {/* Contact Options */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
              <a href="mailto:info@holescale.com" className="text-primary hover:underline">
                info@holescale.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">Questions about HoleScale</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support</h3>
              <a href="mailto:support@holescale.com" className="text-primary hover:underline">
                support@holescale.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">Help with the platform</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnerships</h3>
              <a href="mailto:partnerships@holescale.com" className="text-primary hover:underline">
                partnerships@holescale.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">Business opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Send Us a Message</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="How can we help?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinWaitlist"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I'd like to join the waitlist</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                We'll respond within 24 hours.
              </p>
            </form>
          </Form>
        </div>
      </section>

      {/* Schedule a Demo */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prefer to Talk?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a 15-minute intro call with our team
          </p>
          <Button asChild size="lg">
            <a href="https://calendly.com/holescale" target="_blank" rel="noopener noreferrer">
              Book a Time
            </a>
          </Button>
        </div>
      </section>

      {/* Location */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span>HoleScale is headquartered in Colorado, USA.</span>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://linkedin.com/company/holescale"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/holescale"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Callout */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for quick answers? Check our FAQ page.
          </p>
          <Button asChild variant="outline">
            <Link to="/faq">View FAQ</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
