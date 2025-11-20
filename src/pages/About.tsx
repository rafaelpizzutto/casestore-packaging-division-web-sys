import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Globe, TrendingUp } from "lucide-react";

import heroWarehouse from "@/assets/hero-warehouse.jpg";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "We source and deliver only the highest quality packaging supplies and materials.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your success is our priority. We build lasting relationships with our clients.",
    },
    {
      icon: TrendingUp,
      title: "Innovation Driven",
      description: "Leading the industry with cutting-edge technology like Warehouse Tracker AI.",
    },
    {
      icon: Globe,
      title: "Nationwide Service",
      description: "U.S. based with reliable shipping and service across the country.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About CaseStore LLC</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in packaging, logistics, and warehouse management technology
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={heroWarehouse}
                alt="CaseStore warehouse operations"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <p className="text-muted-foreground text-lg">
                CaseStore LLC was founded with a simple mission: to provide businesses with 
                reliable, high-quality packaging supplies while revolutionizing warehouse 
                management through technology.
              </p>
              <p className="text-muted-foreground text-lg">
                With years of experience in packaging, warehousing, and logistics, we understand 
                the challenges businesses face in managing their supply chain operations. That's 
                why we've combined traditional product excellence with cutting-edge AI technology.
              </p>
              <p className="text-muted-foreground text-lg">
                Based in the United States, we serve warehouses, distribution centers, and 
                businesses nationwide, delivering both products and innovation that drive 
                efficiency and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground text-lg">
              We envision a future where warehouse operations are seamlessly integrated with 
              intelligent technology, where businesses of all sizes have access to enterprise-grade 
              tools, and where supply chain efficiency is maximized through innovation.
            </p>
            <p className="text-muted-foreground text-lg">
              With Warehouse Tracker AI and our commitment to quality products and service, 
              we're building that future today. We believe in transparency, reliability, and 
              empowering our customers with the tools they need to succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications & Partnerships</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Proud to work with industry leaders and maintain the highest standards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold mb-2">Quality Certified</h3>
                <p className="text-sm text-muted-foreground">
                  All products meet or exceed industry quality standards
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold mb-2">U.S. Based</h3>
                <p className="text-sm text-muted-foreground">
                  American company serving businesses nationwide
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold mb-2">Industry Partners</h3>
                <p className="text-sm text-muted-foreground">
                  Partnerships with leading logistics and technology providers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
