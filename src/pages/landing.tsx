"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import {
  FileCheck,
  Users,
  BarChart,
  Lock,
  FileText,
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react"
import AicteImage from '@/assets/aicte-graphic.png'
export default function Component() {
  const navigate = useNavigate()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
      } 
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const features = [
    { title: "Automated Approvals", icon: FileCheck, description: "Expedite the approval process with our automated system." },
    { title: "Transparent Evaluation", icon: Users, description: "Ensure fairness and clarity in the evaluation process." },
    { title: "Real-time Tracking", icon: BarChart, description: "Monitor application status with detailed progress updates." },
    { title: "Secure Documents", icon: Lock, description: "State-of-the-art encryption for document protection." },
    { title: "Easy Submission", icon: FileText, description: "Submit documents through our user-friendly interface." },
    { title: "Detailed Reports", icon: Search, description: "Generate insights into your approval process." },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">AICTE Portal</div>
          <div className="flex items-center gap-8">
            
            <Button onClick={()=>{
              navigate("/institute/login")
            }} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Institute Login
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              Evaluator Login
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900"
                  variants={itemVariants}
                >
                  AICTE Institute Approval Platform 
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-600 max-w-xl"
                  variants={itemVariants}
                >
                  A streamlined digital platform for managing technical education approvals, built for the future of education in India.
                </motion.p>
                <motion.div 
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 h-12 text-lg">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 h-12 text-lg">
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative"
              >
                <div className="relative aspect-square">
                  <img
                    src={AicteImage}
                    alt="Digital Education Platform"
                    className="object-cover rounded-2xl h-[500px]"
                  />
                </div>
                <div className="absolute -inset-4 bg-blue-600/20 blur-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="bg-white border-gray-200 hover:border-blue-600 transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-blue-600 text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="max-w-2xl mx-auto space-y-12"
            >
              <motion.h2 
                className="text-4xl font-bold text-gray-900"
                variants={itemVariants}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg"
                variants={itemVariants}
              >
                Join thousands of institutions already using our platform to streamline their approval process.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                variants={itemVariants}
              >
                <Button
                  asChild
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 h-12 text-lg"
                >
                  <Link to="/institute">Register Institution</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 h-12 text-lg"
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>011-29581000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>helpdesk1@aicte-india.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Nelson Mandela Marg, Vasant Kunj, New Delhi-110070</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="#" className="block text-gray-300 hover:text-white">About AICTE</Link>
                <Link to="#" className="block text-gray-300 hover:text-white">Regulations</Link>
                <Link to="#" className="block text-gray-300 hover:text-white">Resources</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <div className="space-y-3">
                <Link to="#" className="block text-gray-300 hover:text-white">Privacy Policy</Link>
                <Link to="#" className="block text-gray-300 hover:text-white">Terms of Service</Link>
                <Link to="#" className="block text-gray-300 hover:text-white">Disclaimer</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} All India Council for Technical Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}