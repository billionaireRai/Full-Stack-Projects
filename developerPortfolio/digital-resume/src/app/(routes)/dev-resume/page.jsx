'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Code, Award, BookOpen, Cpu, Globe } from 'lucide-react'

const ResumePage = () => {
  // Resume data
  const resumeData = {
    name: "AMRITANSH RAI",
    title: "FULL-STACK WEB DEVELOPER / TECH ENTHUSIAST",
    contact: {
      location: "New Delhi, India",
      phone: "+91 9818864977",
      email: "your.email@example.com"
    },
    summary: "Passionate full-stack developer with 5+ years of experience building cutting-edge web applications. Specializing in React, Node.js, and modern JavaScript frameworks. Continuously expanding expertise in Data Science and Machine Learning.",
    experiences: [
      {
        role: "Weather Application",
        period: "March 2024",
        achievements: [
          "Built real-time weather data visualization using OpenWeather API",
          "Implemented caching for 40% faster load times",
          "Designed responsive UI with animated weather transitions"
        ],
        tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"]
      },
      {
        role: "E-Commerce Platform",
        period: "April 2024",
        achievements: [
          "Developed complete shopping cart & checkout flow",
          "Integrated Razorpay payment gateway",
          "Achieved 99.8% uptime with error monitoring"
        ],
        tech: ["Next.js", "Express", "PostgreSQL", "JWT"]
      },
      // Add other experiences...
    ],
    education: [
      {
        degree: "B.Tech Mechanical Engineering",
        institution: "Dr. Akhilesh Das Gupta Institute",
        period: "2024 - Present",
        highlights: ["CGPA: 8.5/10", "Technical Club President"]
      }
    ],
    skills: {
      frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
      backend: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
      devops: ["Docker", "AWS", "CI/CD", "NGINX"]
    },
    certifications: [
      "MERN Stack Certification (Pregrad, 2025)",
      "AWS Certified Developer (2024)"
    ]
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Resume.docx'
    link.download = 'Amritansh_Rai_Resume.docx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  // State to store window dimensions
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set window dimensions on client side
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-22 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Floating Particles Background */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          {windowSize.width > 0 && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/10"
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                size: Math.random() * 10 + 5
              }}
              animate={{
                x: [null, Math.random() * windowSize.width],
                y: [null, Math.random() * windowSize.height],
                transition: {
                  duration: Math.random() * 30 + 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
            />
          ))}
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold mb-2"
                >
                  {resumeData.name}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl opacity-90"
                >
                  {resumeData.title}
                </motion.p>
              </div>
              
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 flex items-center cursor-pointer gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </motion.button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Sidebar */}
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="lg:col-span-1 bg-gray-50 dark:bg-gray-700 p-8"
            >
              {/* Contact */}
              <motion.div variants={item} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Contact
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{resumeData.contact.email}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span>{resumeData.contact.phone}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span>{resumeData.contact.location}</span>
                  </li>
                </ul>
              </motion.div>

              {/* Skills */}
              <motion.div variants={item} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Skills
                </h3>
                <div className="space-y-4">
                  {Object.entries(resumeData.skills).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 capitalize">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span 
                            key={skill}
                            className="px-3 py-1 bg-white dark:bg-gray-600 rounded-full text-sm text-gray-800 dark:text-gray-200 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div variants={item}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Certifications
                </h3>
                <ul className="space-y-3">
                  {resumeData.certifications.map((cert) => (
                    <li key={cert} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3 p-8">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Professional Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resumeData.summary}
                </p>
              </motion.div>

              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Work Experience
                </h2>
                <div className="space-y-8">
                  {resumeData.experiences.map((exp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="pl-6 border-l-2 border-blue-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {exp.role}
                        </h3>
                        <span className="text-sm text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-3">
                        {exp.achievements.map((ach, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 + 0.2 }}
                            viewport={{ once: true }}
                            className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                          >
                            <span className="text-blue-500 mt-1.5 text-xl">➤</span>
                            <span>{ach}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Education */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Education
                </h2>
                <div className="space-y-8">
                  {resumeData.education.map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="pl-6 border-l-2 border-blue-500/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {edu.degree}
                        </h3>
                        <span className="text-sm text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {edu.institution}
                      </p>
                      <ul className="space-y-2">
                        {edu.highlights.map((hl, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 + 0.2 }}
                            viewport={{ once: true }}
                            className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                          >
                            <span className="text-blue-500 mt-1.5 text-xl">➤</span>
                            <span>{hl}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumePage
