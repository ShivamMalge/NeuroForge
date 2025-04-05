import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Brain, Code, LineChart, Github, Linkedin, Instagram } from "lucide-react"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About | NeuroForge",
  description: "About the developer behind NeuroForge",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center h-16 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to NeuroForge
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 py-12 mx-auto max-w-4xl">
        <div className="space-y-12">
          {/* Hero section */}
          <section className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Brain className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">About the Developer</h1>
          </section>

          {/* Bio section */}
          <section className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                Designed and developed by Shivam Malge, a passionate developer blending the worlds of AI, finance, and
                web development. Currently pursuing Computer Science with a focus on Data Science, Shivam believes in
                building tools that make complex ideas feel simple — and fun.
              </p>
            </div>
          </section>

          {/* Project section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">About NeuroForge</h2>
            <p className="text-muted-foreground">
              NeuroForge is a visual neural network builder that makes AI model design accessible to everyone. The
              project aims to demystify deep learning by providing an intuitive interface for creating, training, and
              understanding neural networks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
                <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Visual Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize neural network architecture and training processes to better understand how AI models work.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
                <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Code Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate TensorFlow and TensorFlow.js code from your visual model designs.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
                <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">Real-time Training</h3>
                <p className="text-sm text-muted-foreground">
                  Train models directly in your browser and visualize performance metrics in real-time.
                </p>
              </div>
            </div>
          </section>

          {/* Skills section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Technologies Used</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "TensorFlow.js",
                "Tailwind CSS",
                "Framer Motion",
                "TensorFlow",
                "Python",
              ].map((tech) => (
                <div key={tech} className="bg-secondary/30 rounded-md px-4 py-2 text-center text-sm font-medium">
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* Contact section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Interested in collaborating or have questions about NeuroForge? Feel free to reach out.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <a
                href="https://github.com/ShivamMalge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 transition-colors px-4 py-2 rounded-md text-sm"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/shivam-malge-12523a293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 transition-colors px-4 py-2 rounded-md text-sm"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/epsilon_edge?igsh=MTduNDFqdWd5NGlwMQ=="
                className="inline-flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 transition-colors px-4 py-2 rounded-md text-sm"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

