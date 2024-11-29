'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Mail, Lock, ClipboardCheck, Award, Scale, BookOpen } from 'lucide-react'
import AicteLogo from '@/assets/aicte-logo.webp'

export default function EvaluatorAuth() {
  const [activeTab, setActiveTab] = useState('register')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  }

  const benefits = [
    { icon: ClipboardCheck, title: "Streamlined Evaluation", description: "Efficiently assess institution applications" },
    { icon: Award, title: "Contribute to Excellence", description: "Help maintain high educational standards" },
    { icon: Scale, title: "Fair Assessment", description: "Ensure equitable evaluation processes" },
    { icon: BookOpen, title: "Continuous Learning", description: "Stay updated with latest educational trends" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <img src={AicteLogo} alt="AICTE Logo" className="h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-navy-600 mb-2">AICTE Evaluator Portal</h1>
          <p className="text-xl text-gray-600">Empowering Excellence through Expert Evaluation</p>
        </motion.div>

        <div className="flex flex-wrap -mx-4">
          <motion.div
            className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="bg-white border-2 border-navy-100 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-navy-600 border-b-2 border-gold-300 pb-2">Evaluator Benefits</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div key={index} className="flex items-start space-x-4" variants={itemVariants}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-navy-600">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="w-full lg:w-2/3 px-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="bg-white border-2 border-navy-100 rounded-lg p-8 shadow-md">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="register" className="text-lg">Register</TabsTrigger>
                  <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="register">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="name" className="text-navy-600">Full Name</Label>
                      <div className="flex mt-1">
                        <UserCheck className="w-5 h-5 mr-2 text-navy-400" />
                        <Input id="name" placeholder="Enter your full name" required className="flex-grow" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="email" className="text-navy-600">Email Address</Label>
                      <div className="flex mt-1">
                        <Mail className="w-5 h-5 mr-2 text-navy-400" />
                        <Input id="email" type="email" placeholder="your.email@example.com" required className="flex-grow" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="password" className="text-navy-600">Create Password</Label>
                      <div className="flex mt-1">
                        <Lock className="w-5 h-5 mr-2 text-navy-400" />
                        <Input id="password" type="password" placeholder="Create a secure password" required className="flex-grow" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full bg-black hover:bg-navy-700 text-white">Register as Evaluator</Button>
                    </motion.div>
                  </form>
                </TabsContent>
                <TabsContent value="login">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="login-email" className="text-navy-600">Email Address</Label>
                      <div className="flex mt-1">
                        <Mail className="w-5 h-5 mr-2 text-navy-400" />
                        <Input id="login-email" type="email" placeholder="your.email@example.com" required className="flex-grow" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="login-password" className="text-navy-600">Password</Label>
                      <div className="flex mt-1">
                        <Lock className="w-5 h-5 mr-2 text-navy-400" />
                        <Input id="login-password" type="password" placeholder="Enter your password" required className="flex-grow" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full bg-black hover:bg-navy-700 text-white">Access Evaluator Portal</Button>
                    </motion.div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 text-center text-sm text-gray-600"
          variants={containerVariants}
        >
          For technical support, contact AICTE helpdesk: <a href="mailto:helpdesk1@aicte-india.org" className="text-navy-600 hover:underline">helpdesk1@aicte-india.org</a>
        </motion.div>
      </div>
    </div>
  )
}