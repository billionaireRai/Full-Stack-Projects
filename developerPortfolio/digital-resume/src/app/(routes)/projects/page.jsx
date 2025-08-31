'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Code, Eye, Github, Link2, MoveRight, ArrowRight, ShoppingCart, LayoutDashboard, CheckCircle, Cloud, Cpu, Palette, Smartphone, Globe } from 'lucide-react'

const ProjectPage = () => {
  const projects = [
    {
      id: 1,
      title: "Enterprise E-Commerce Solution",
      description: "Led development of a scalable e-commerce platform processing $2M+ monthly revenue with 99.9% uptime.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      metrics: [
        "Increased conversion by 32% through optimized checkout",
        "Reduced load times by 40% with performance tuning",
        "Implemented CI/CD pipeline cutting deployment time by 65%"
      ],
      icon: <ShoppingCart className="w-6 h-6" />,
      accentColor: "from-purple-500 to-pink-500",
      role: "Lead Frontend Developer"
    },
    {
      id: 2,
      title: "Corporate Dashboard Redesign",
      description: "Architected data visualization system for Fortune 500 client, handling 10M+ daily data points.",
      technologies: ["Next.js", "D3.js", "TypeScript", "AWS"],
      metrics: [
        "Improved data rendering performance by 75%",
        "Reduced client support tickets by 60%",
        "Delivered project 2 weeks ahead of deadline"
      ],
      icon: <LayoutDashboard className="w-6 h-6" />,
      accentColor: "from-cyan-400 to-blue-500",
      role: "Senior Full Stack Engineer"
    },
    {
      id: 3,
      title: "Productivity Suite",
      description: "Built task management system adopted by 50+ enterprise teams with 95% user satisfaction.",
      technologies: ["React", "Firebase", "NLP", "Jest"],
      metrics: [
        "Achieved 100% test coverage",
        "Reduced onboarding time by 45%",
        "Scaled to support 10K concurrent users"
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      accentColor: "from-green-400 to-emerald-500",
      role: "Product Engineer"
    },
    {
      id: 4,
      title: "Weather Analytics Platform",
      description: "Developed predictive weather system with 92% forecast accuracy for agricultural clients.",
      technologies: ["Python", "TensorFlow", "Mapbox", "PostGIS"],
      metrics: [
        "Processed 1TB+ weather data daily",
        "Reduced prediction latency by 30%",
        "Won 2023 Tech Innovation Award"
      ],
      icon: <Cloud className="w-6 h-6" />,
      accentColor: "from-amber-400 to-orange-500",
      role: "Data Engineering Lead"
    }
  ]

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

  return (
    <div className="bg-white dark:bg-black min-h-screen py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            PROFESSIONAL PORTFOLIO
          </motion.span>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Delivering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Enterprise-Grade Solutions</span><br/>Through Technical Excellence
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Each project represents measurable business impact, showcasing my ability to solve complex technical challenges while driving organizational success.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              {/* Project Header */}
              <motion.div 
                className={`h-48 bg-gradient-to-r ${project.accentColor} flex items-center justify-between p-8`}
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div 
                  className="p-6 bg-white/10 backdrop-blur-sm rounded-full"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {project.icon}
                </motion.div>
                <motion.span 
                  className="px-4 py-2 bg-black/20 text-white text-sm font-medium rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {project.role}
                </motion.span>
              </motion.div>

              {/* Project Content */}
              <div className="p-8">
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {project.title}
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-6 text-lg"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {project.description}
                </motion.p>
                
                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 tracking-wider uppercase">Key Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <motion.span 
                        key={index}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full flex items-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.accentColor} mr-2`}></span>
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 tracking-wider uppercase">Key Achievements</h3>
                  <ul className="space-y-4">
                    {project.metrics.map((metric, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start"
                      >
                        <motion.div 
                          className={`flex-shrink-0 mt-1 mr-4 bg-gradient-to-r ${project.accentColor} p-0.5 rounded-full`}
                          whileHover={{ rotate: 90 }}
                        >
                          <div className="bg-white dark:bg-gray-900 p-1 rounded-full">
                            <ArrowRight className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500" />
                          </div>
                        </motion.div>
                        <span className="text-gray-700 dark:text-gray-300 text-base">{metric}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Project Links */}
                <motion.div 
                  className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.a
                    href={`https://github.com/billionaireRai/${project.title}`}
                    className="flex gap-2 items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-medium"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image className='dark:invert' src='/github-logo.svg' width={30} height={30} alt='github-logo' />
                    <span>Case Study</span>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-base font-medium"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    <span>Live Demo</span>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Call to Action */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="w-3 h-3 rounded-full bg-blue-500 mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              CURRENTLY ACCEPTING NEW OPPORTUNITIES
            </span>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            Let's Build Something Extraordinary Together
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            I specialize in delivering high-impact technical solutions that drive business growth. Let's discuss how I can contribute to your team's success.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg text-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              get In Touch
              <Link2 className="w-5 h-5 ml-2" />
            </motion.a>
            <motion.a
              href="/dev-resume"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Resume
              <MoveRight className="w-5 h-5 ml-2" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Professional decorative elements */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
    </div>
  )
}

export default ProjectPage