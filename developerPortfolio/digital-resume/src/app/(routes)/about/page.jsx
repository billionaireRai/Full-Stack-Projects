'use client'

import React from "react";
import Image from "next/image";
import Dotter from "@/components/dotter";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariantsLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } },
  hover: { scale: 1.01 }
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50 } },
  hover: { scale: 1.01 }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.01 }
};

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 10
};

// Component for technology icons
const TechIcon = ({ icon, name, efficiency }) => {
  // parameters for efficincy icon...
  const radius = 60;
  const stroke = 9;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (efficiency / 100) * circumference;

  return (
    <motion.div 
      className="group flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      variants={fadeUp}
      whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgb(59 130 246)" }}
    >
      <span>{icon}</span>
      <span className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{name}</span>
      <div className='circular-percentage mt-3 rotate-90 hidden group-hover:block'>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#e5e7eb" // gray-200
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#3b82f6" // blue-500
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fill="#3b82f6"
            className="font-semibold"
          >
            {efficiency}%
          </text>
        </svg>
      </div>
    </motion.div>
  );
};

// Component for timeline items
const TimelineItem = ({ date, title, content, alignment }) => {
  const variants = alignment === 'left' ? itemVariantsLeft : itemVariantsRight;
  return (
    <motion.div 
      className={`relative flex ${alignment === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center cursor-pointer`}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover="hover"
    >
      <div className={`hidden md:block absolute ${alignment === 'left' ? 'left-1/2 ml-4' : 'right-1/2 mr-4'} w-4 h-4 bg-blue-500 rounded-full z-10`}></div>
      
      <div className={`md:w-5/12 ${alignment === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
        <div className="md:hidden w-4 h-4 bg-blue-500 rounded-full absolute left-1/2 transform -translate-x-1/2 -translate-y-6"></div>
        <div className="text-blue-600 font-bold mb-2 md:mb-0">{date}</div>
      </div>
      
      <div className={`hidden md:block md:w-2/12 ${alignment === 'left' ? 'text-right' : 'text-left'}`}></div>
      
      <div className={`md:w-5/12 ${alignment === 'left' ? 'md:pl-8' : 'md:pr-8 md:text-right'}`}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{content}</p>
      </div>
    </motion.div>
  );
};

// Component for philosophy cards
const PhilosophyCard = ({ title, content, icon }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      variants={fadeUp}
      whileHover={{ scale: 1.02, boxShadow: "0px 0px 12px rgb(59 130 246)" }}
    >
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
    </motion.div>
  );
};

const AboutPage = () => {
  const [skillsArray, setskillsArray] = useState([
      {
        technology: "Python",
        icon: '/python-logo.svg',
        efficiency: 85
      },
      {
        technology: "JavaScript",
        icon: '/javascript-logo.svg',
        efficiency: 80
      },
      {
        technology: "C language",
        icon: '/C-logo.svg',
        efficiency: 70
      },
      {
        technology: "Git",
        icon: '/github-logo.svg',
        efficiency: 75
      },
      {
        technology: "React",
        icon: '/react-logo.svg',
        efficiency: 80
      },
      {
        technology: "Next.js",
        icon: '/nextjs-logo.svg',
        efficiency: 75
      },
      {
        technology: "Node.js",
        icon: '/nodejs-logo.svg',
        efficiency: 70
      },
      {
        technology: "Express",
        icon: '/expressjs-logo.svg',
        efficiency: 65
      },
      {
        technology: "MongoDB",
        icon: '/mongodb-logo.svg',
        efficiency: 60
      },
      {
        technology: "HTML",
        icon: '/html-logo.svg',
        efficiency: 90
      },
      {
        technology: "CSS",
        icon: '/css-logo.svg',
        efficiency: 85
      },
      {
        technology: "Tailwind CSS",
        icon: '/tailwindcss-logo.svg',
        efficiency: 80
      },
      {
        technology: "Framer Motion",
        icon: '/framer-motion-logo.svg',
        efficiency: 70
      },
      {
        technology: "Docker",
        icon: '/docker-logo.svg',
        efficiency: 60
      },
      {
        technology: "Kubernetes",
        icon: '/kubernetes-logo.svg',
        efficiency: 50
      },
      {
        technology: "TypeScript",
        icon: '/typescript-logo.svg',
        efficiency: 75
      },
      {
        technology: "PostgreSQL",
        icon: '/postgresSQL-logo.svg',
        efficiency: 65
      }
    ]) ;
  return (
    <motion.div 
      className="min-h-screen mt-16 rounded-xl p-6 bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 transition-colors duration-500"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section 
        style={{ backgroundImage: "url('/tech-bg.jpg')" , backgroundPosition:'center' }} 
        className="relative py-20 bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg dark:shadow-black shadow-2xl mb-16 overflow-hidden"
        variants={fadeUp}
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div className="flex justify-center items-center mb-6" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{duration:1, repeat: Infinity, repeatType: "mirror", ease:"easeInOut"}}>
            <motion.div animate={{ rotate: 360 }} transition={spinTransition}>
              <Image src="/portfolio-logo.svg" width={60} height={60} alt="Logo" className="invert mr-4" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{delay:0.3, duration:0.8}}
            >
              My Journey in Tech
            </motion.h1>
          </motion.div>
          <motion.p 
            className="text-lg md:text-xl text-indigo-200 max-w-4xl mx-auto mb-8"
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{delay:0.5, duration:0.8}}
          >
            From curious beginner to passionate developer - here's my story of growth, challenges, and achievements in the world of technology.
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Introduction Section */}
        <motion.section className="mb-36" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/3 mb-8 md:mb-0"
              variants={fadeUp}
            >
              {/* Profile image placeholder with improved styling */}
              <motion.div 
                className="bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full h-64 w-64 mx-auto flex items-center justify-center shadow-xl dark:shadow-gray-700 overflow-hidden border-3 border-white dark:border-gray-700"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, yoyo: Infinity }}
              >
                <Image src="/amritansh-avatar.png" alt="Profile Image" width={256} height={256} className="object-cover rounded-full" />
              </motion.div>
            </motion.div>
            <motion.div className="md:w-2/3 md:pl-12" variants={containerVariants}>
              <motion.h2 className="text-3xl font-bold mb-6" variants={fadeUp}>Who I Am</motion.h2>
              <motion.p className="text-lg mb-4" variants={fadeUp}>
                I'm a passionate software developer with a focus on creating beautiful, functional, and user-centric digital experiences. 
                My journey in technology has been one of continuous learning and growth.
              </motion.p>
              <motion.p className="text-lg mb-4" variants={fadeUp}>
                With a background in [your background if any], I bring a unique perspective to problem-solving 
                and a dedication to writing clean, efficient code.
              </motion.p>
              <motion.p className="text-lg" variants={fadeUp}>
                When I'm not coding, you can find me [your hobbies/interests], constantly seeking inspiration 
                from the world around me.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section className="mb-36" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeUp}>My Tech Stack</motion.h2>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" variants={containerVariants}>
            {skillsArray.map((skill, index) => (
              <TechIcon 
                key={index + 1} 
                icon={<Image src={skill.icon} alt={skill.technology + " logo"} width={40} height={40} className="object-contain" />} 
                name={skill.technology} 
                efficiency={skill.efficiency}
              />
            ))}
          </motion.div>
        </motion.section>

        {/* Journey Timeline */}
        <motion.section className="mb-36" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeUp}>My Development Journey</motion.h2>
          <motion.div className="relative">
            {/* Timeline line */}
            <motion.div 
              className="hidden md:block absolute left-1/2 h-full w-1 bg-blue-200 transform -translate-x-1/2"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            ></motion.div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {/* Item 1 */}
              <TimelineItem 
                date="2018" 
                title="The Spark of Interest" 
                content="My journey began when I first discovered programming through [how you got interested]. I was fascinated by how code could create things and solve problems. I started with basic HTML and CSS, building simple static websites."
                alignment="left"
              />
              
              {/* Item 2 */}
              <TimelineItem 
                date="2019" 
                title="Diving Deeper" 
                content="I expanded my knowledge to JavaScript and began learning programming fundamentals. Built my first interactive projects and started understanding the power of front-end development. Completed several online courses to strengthen my foundation."
                alignment="right"
              />
              
              {/* Item 3 */}
              <TimelineItem 
                date="2020" 
                title="First Real Projects" 
                content="Started working on more complex projects, implementing APIs and building full-stack applications. Learned React and fell in love with component-based architecture. Contributed to open source projects to gain real-world experience."
                alignment="left"
              />
              
              {/* Item 4 */}
              <TimelineItem 
                date="2021" 
                title="Professional Growth" 
                content="Landed my first professional role as a [position] at [company]. Worked on production applications and learned about team collaboration, version control, and agile methodologies. Expanded my backend knowledge with Node.js and databases."
                alignment="right"
              />
              
              {/* Item 5 */}
              <TimelineItem 
                date="2022" 
                title="Specialization" 
                content="Focused on mastering React ecosystem including advanced state management, performance optimization, and testing. Discovered Tailwind CSS and adopted it as my go-to CSS framework for its utility-first approach and rapid development capabilities."
                alignment="left"
              />
              
              {/* Item 6 */}
              <TimelineItem 
                date="2023 - Present" 
                title="Continuous Learning" 
                content="Currently expanding my expertise in [current learning focus]. Working on [current projects]. Actively participating in developer communities and mentoring newcomers to give back to the community that helped me grow."
                alignment="right"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section className="mb-36 bg-white dark:bg-black p-8 rounded-xl shadow-md" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 className="text-3xl font-bold mb-6 text-center" variants={fadeUp}>My Development Philosophy</motion.h2>
<motion.div className="grid md:grid-cols-3 gap-8" variants={containerVariants}>
  <PhilosophyCard 
    title="User-Centric Design" 
    content="I believe technology should serve people. Every decision I make in development starts with considering the end user's needs and experience." 
    icon="👥"
  />
  <PhilosophyCard 
    title="Clean Code" 
    content="Writing maintainable, readable code is a priority. I follow best practices and constantly refactor to improve code quality." 
    icon="🧹"
  />
  <PhilosophyCard 
    title="Continuous Learning" 
    content="The tech landscape evolves rapidly. I dedicate time each week to learning new technologies and improving my skills." 
    icon="📚"
  />
  <PhilosophyCard 
    title="Collaboration" 
    content="I value teamwork and open communication. Great software is built by diverse minds working together towards a common goal." 
    icon="🤝"
  />
  <PhilosophyCard 
    title="Adaptability" 
    content="Technology changes fast. I embrace change and adapt quickly to new tools, frameworks, and methodologies." 
    icon="🔄"
  />
  <PhilosophyCard 
    title="Quality over Quantity" 
    content="I focus on delivering high-quality features rather than a large quantity of incomplete work." 
    icon="🏆"
  />
</motion.div>
        </motion.section>

        {/* Current Focus Section */}
        <motion.section className="mb-36" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100" variants={fadeUp}>What I'm Focused On Now</motion.h2>
          <motion.div className="bg-gray-100 border-gray-300 dark:bg-black dark:shadow-gray-800 border-2 dark:border-gray-800 p-10 rounded-2xl shadow-lg" variants={containerVariants}>
            <motion.div className="flex flex-col md:flex-row items-center" variants={containerVariants}>
              <motion.div className="md:w-1/2 mb-8 md:mb-0" variants={fadeUp}>
                <motion.h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100" variants={fadeUp}>Current Learning & Projects</motion.h3>
                <motion.ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300" variants={containerVariants}>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">📌</span>
                    <span>Deepening my knowledge of [specific technology or concept]</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">📌</span>
                    <span>Building [current project] to solve [problem it addresses]</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">📌</span>
                    <span>Contributing to open-source projects in the [specific domain] space</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">📌</span>
                    <span>Exploring [emerging technology] and its potential applications</span>
                  </motion.li>
                </motion.ul>
              </motion.div>
              <motion.div className="md:w-1/2 md:pl-12" variants={fadeUp}>
                <motion.h3 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100" variants={fadeUp}>Future Goals</motion.h3>
                <motion.ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300" variants={containerVariants}>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">🚀</span>
                    <span>Master [specific skill or technology] to build more robust applications</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">🚀</span>
                    <span>Develop expertise in [specific domain like AI, blockchain, etc.]</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">🚀</span>
                    <span>Launch my own [product/service idea] to help [target audience]</span>
                  </motion.li>
                  <motion.li className="flex items-start" variants={fadeUp}>
                    <span className="mr-3 text-indigo-600 dark:text-indigo-400">🚀</span>
                    <span>Mentor more junior developers and contribute to tech education</span>
                  </motion.li>
                </motion.ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Call to Action */}
        <motion.section className="text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 className="text-3xl font-bold mb-6" variants={fadeUp}>Want to Work Together?</motion.h2>
          <motion.p className="text-xl mb-8 max-w-2xl mx-auto" variants={fadeUp}>
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </motion.p>
          <motion.a 
            href="/contact" 
            className="inline-block shadow-blue-900 hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            whileHover={{ scale: 1.03, boxShadow: "0px 0px 12px rgb(59 130 246)" }}
          >
            Get In Touch
          </motion.a>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer className="bg-white dark:bg-black py-12 rounded-xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <div className="container mx-auto px-6">
          <motion.div className="flex flex-col md:flex-row justify-between items-center" variants={containerVariants}>
            <motion.div className="mb-6 md:mb-0" variants={fadeUp}>
              <div className="flex items-center">
                <motion.div className="p-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer" whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgb(59 130 246)" }}>
                  <Link href='/'>
                    <Image src='/portfolio-logo.svg' width={35} height={35} alt="logo-bottom" className="dark:invert" />
                  </Link>
                </motion.div>
                <motion.span className="ml-4 text-2xl font-extrabold text-gray-900 dark:text-gray-100" variants={fadeUp}>dev.Amritansh</motion.span>
              </div>
              <motion.p className="mt-3 flex flex-row items-center text-gray-500 dark:text-gray-400" variants={fadeUp}><span>Building digital experiences with care</span><Dotter timeGap={0.8}/></motion.p>
            </motion.div>
            
            <motion.div className="flex space-x-8" variants={fadeUp}>
              <Link href="https://github.com/billionaireRai" className="dark:invert text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <motion.img src='github-logo.svg' className="transition-all duration-100 cursor-pointer" width={30} height={30} alt="git" whileHover={{ scale: 1.2, filter: "brightness(1.2)" }} />
              </Link>
              <Link href="" className="text-gray-500 dark:invert dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <motion.img src='linkedIn-logo.svg' className="transition-all duration-100 cursor-pointer" width={30} height={30} alt="git" whileHover={{ scale: 1.2, filter: "brightness(1.2)" }} />
              </Link>
              <Link href="https://x.com/Amritansh_Coder" className="dark:invert text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <motion.img src='twitter-logo.svg' className="transition-all duration-100 cursor-pointer" width={30} height={30} alt="git" whileHover={{ scale: 1.1, filter: "brightness(1.2)" }} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div className="mt-10 pt-10 border-t border-gray-300 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400" variants={fadeUp}>
            <p>&copy; {new Date().getFullYear()} dev.Amritansh All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default AboutPage;
