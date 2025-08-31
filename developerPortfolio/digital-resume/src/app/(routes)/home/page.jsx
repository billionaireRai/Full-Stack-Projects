"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import GitHubLogoIcon from "/public/github-logo.svg";
import Dotter from "@/components/dotter";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
const GitHubCalendar = dynamic(() => import("react-github-calendar"), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [githubStartYear, setgithubStartYear] = useState(2024) ; // holding state for github start year...
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [githubYearArray, setgithubYearArray] = useState([githubStartYear]);
  const [hireMe, sethireMe] = useState(false);
  const [pointOnWork, setpointOnWork] = useState(
    [
      {
        title: "Clean Code & DRY",
        description: "Writing clean, reusable code reduces bugs and improves maintainability."
      },
      {
        title: "Security & Performance First",
        description: "Prioritizing security and performance ensures reliable and fast applications."
      },
      {
        title: "Collaborative & Open Source Friendly",
        description: "Working collaboratively and contributing to open source fosters innovation."
      },
      {
        title: "Test-Driven Development",
        description: "Writing tests before code leads to better design and fewer bugs."
      },
      {
        title: "Continuous Learning & Improvement",
        description: "Top developers constantly learn to stay ahead in the fast-changing tech world."
      },
      {
        title: "Effective Communication & Feedback",
        description: "Clear communication and feedback improve team productivity and code quality."
      },
      {
        title: "Automate Repetitive Tasks",
        description: "Automation saves time and reduces human error in development workflows."
      },
      {
        title: "Write Readable & Maintainable Code",
        description: "Readable code is easier to understand, debug, and extend by others."
      },
      {
        title: "Prioritize User Experience",
        description: "Focusing on UX ensures the product meets user needs and expectations."
      },
      {
        title: "Embrace Code Reviews & Pair Programming",
        description: "Collaborative coding practices improve code quality and knowledge sharing."
      }
    ]
  )
  const [projectDes, setprojectDes] = useState([
  {
    projectNo: 1 ,
    projectTitle: "Project 1",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 2 ,
    projectTitle: "Project 2",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 3 ,
    projectTitle: "Project 3",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 4 ,
    projectTitle: "Project 4",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 5 ,
    projectTitle: "Project 5",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 6 ,
    projectTitle: "Project 6",
    projectDescription: "This is a short description of my project 1",
  },
  {
    projectNo: 7 ,
    projectTitle: "Project 7",
    projectDescription: "This is a short description of my project 1",
  },
])
  const [skillsArray, setskillsArray] = useState([
    {
      technology: "Python",
      icon: '/python-logo.svg'
    },
    {
      technology: "JavaScript",
      icon: '/javascript-logo.svg'
    },
    {
      technology: "C language",
      icon: '/C-logo.svg'
    },
    {
      technology: "Git",
      icon: '/github-logo.svg'
    },
    {
      technology: "React",
      icon: '/react-logo.svg'
    },
    {
      technology: "Next.js",
      icon: '/nextjs-logo.svg'
    },
    {
      technology: "Node.js",
      icon: '/nodejs-logo.svg'
    },
    {
      technology: "Express",
      icon: '/expressjs-logo.svg'
    },
    {
      technology: "MongoDB",
      icon: '/mongodb-logo.svg'
    },
    {
      technology: "HTML",
      icon: '/html-logo.svg'
    },
    {
      technology: "CSS",
      icon: '/css-logo.svg'
    },
    {
      technology: "Tailwind CSS",
      icon: '/tailwindcss-logo.svg'
    },
    {
      technology: "Framer Motion",
      icon: '/framer-motion-logo.svg'
    },
    {
      technology: "Docker",
      icon: '/docker-logo.svg'
    },
    {
      technology: "Kubernetes",
      icon: '/kubernetes-logo.svg'
    },
    {
      technology: "TypeScript",
      icon: '/typescript-logo.svg'
    },
    {
      technology: "PostgreSQL",
      icon: '/postgresSQL-logo.svg'
    }
  ]) ;
  const [timeLine, settimeLine] = useState([ 
    { year: "2020", text: "Got introduced to programming AND coding !!", 
      icon_1: '/window.svg' , icon_2:'/C-logo.svg', icon_3:'/python-logo.svg' },
    { year: "2021", text: "learned some trending && New programming language for me.", 
      icon_1: '/python-logo.svg', icon_2: '/javascript-logo.svg', icon_3: '/C-logo.svg' },
    { year: "2022", text: "Decided to learn WEB DEVELOPEMENT as I was facinated about it since childhood.", 
      icon_1: '/react-logo.svg', icon_2: '/nodejs-logo.svg', icon_3: '/expressjs-logo.svg' },
    { year: "2023", text: "Made My first full-stack-project && Contributed to open-source projects !!", 
      icon_1: '/globe.svg', icon_2: '/mongodb-logo.svg', icon_3: '/nextjs-logo.svg' },
    { year: "2024", text: "Started Building 'lockRift' - A password-manager for removing hassle of rememebering password.", 
      icon_1: '/framer-motion-logo.svg', icon_2: '/tailwindcss-logo.svg', icon_3: '/github-logo.svg' },
    { year: "2025", text: "Started Developing 'Breezly' - A social media platform for production also monetized it && stated DSA in C language.", 
      icon_1: '/docker-logo.svg', icon_2: '/kubernetes-logo.svg', icon_3: '/typescript-logo.svg' },
  ])

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  useEffect(() => {
    let lastYear = githubYearArray[githubYearArray.length - 1];
    if (lastYear < currentYear && !githubYearArray.includes(lastYear + 1)) {
      let yearToAdd = lastYear + 1;
      setgithubYearArray(prevArray => [...prevArray, yearToAdd]);
    }
  }, [githubYearArray, currentYear])
  

  return (
    <main className="min-h-screen bg-white dark:bg-black px-6 md:px-16 lg:px-24 py-20">
      {/* Hero Section */}
      <motion.section
        className="flex flex-col-reverse md:flex-row items-center justify-between gap-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <motion.div custom={1} variants={fadeIn} className="text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Hey 👋 I'm <span className="text-blue-600 dark:text-blue-400 font-extrabold">amritansh_Rai</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-3xl">
             Experienced Full Stack Developer dedicated to crafting modern, intuitive user interfaces combined with secure and scalable backend systems. Deeply passionate about emerging technologies such as Blockchain and Data Science, constantly exploring innovative solutions to complex problems
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link href='/about'>
            <Button className="rounded-xl p-6 text-lg cursor-pointer dark:hover:bg-white">Curious to Dive Deeper</Button>
          </Link>
          <Link onMouseEnter={() => { sethireMe(true)}} onMouseLeave={() => { sethireMe(false) }} href={`/contact-dev?toHireMe=${hireMe}`}>
            <Button 
              variant="outline" 
              className="hire-btn relative rounded-xl p-6 text-lg cursor-pointer">Hire Me
            </Button>
          </Link>
          </div>
        </motion.div>
        <motion.div custom={2} variants={fadeIn} className="relative max-w-lg h-3/4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 40 }}
            className="rounded-md overflow-hidden border-none shadow-2xl dark:shadow-black"
          >
            <img
              src="/amritansh-avatar.png"
              alt="Amritansh Rai"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* GitHub Contribution Calendar */}
      <motion.section className="mt-36 text-center flex flex-col items-center gap-10" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.h2 custom={3} variants={fadeIn} className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          My GitHub Activity
        </motion.h2>  
        {/* <motion.div custom={4} variants={fadeIn} className="flex flex-col items-center gap-8 justify-center h-full"> */}
        {githubYearArray.map((year,i) => (
          <Card key={i + 1} className="shadow-md p-6 rounded-xl dark:bg-gray-900 dark:shadow-blue-900">
            <CardContent>
              {mounted && (
                <>
                  <GitHubCalendar
                    username="billionaireRai"
                    colorScheme={typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"}
                    blockSize={15}
                    blockMargin={5}
                    fontSize={14}
                    loading={ !mounted ? true : false }
                    year={year}
                  />
                  <div className="my-8"></div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        {/* </motion.div> */}
      </motion.section>

      {/* Skills Section */}
      <motion.section className="mt-30" initial="hidden" whileInView="visible">
        <motion.h2 custom={5} variants={fadeIn} className="text-3xl flex flex-row items-center justify-center font-bold text-gray-900 dark:text-gray-100 mb-10">
          <div>Tech Stack I Explored In My Journey</div>
        </motion.h2>
        <motion.div custom={6} variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skillsArray.map((skill, idx) => (
            <motion.div
              key={skill.technology}
              custom={idx + 1}
              variants={fadeIn}
              className="bg-white cursor-pointer hover:border-gray-300 border-none dark:bg-gray-800 rounded-xl text-center hover:bg-gray-100 shadow-md dark:shadow-blue-900 py-4 transition-colors duration-300 flex flex-col items-center justify-center gap-2"
            >
              <Image src={skill.icon} alt={skill.technology} width={40} height={40} className="mx-auto dark:invert" />
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{skill.technology}</span>
            </motion.div>
          ))}
          {/* <motion.div
              custom={7}
              variants={fadeIn}
              className="bg-white hover:border-gray-300 hover:border-2 cursor-pointer dark:bg-gray-800 rounded-xl text-center hover:bg-gray-100 shadow-md dark:shadow-blue-900 py-4 transition-all duration-300 flex flex-col items-center justify-center gap-2"
          >
              <span className="text-gray-900 dark:text-gray-100 font-semibold flex flex-row items-center justify-center">
                <span>ManyMore</span><Dotter timeGap={0.5}/>
              </span>
          </motion.div> */}
        </motion.div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section className="mt-50" initial="hidden" whileInView="visible">
        <motion.h2 custom={8} variants={fadeIn} className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400 text-center">
          <div>Years Invested By Me</div>
        </motion.h2>
        <div className="border-l-4 border-blue-500 dark:border-blue-400 rounded-lg ml-4">
          {timeLine.map(({ year, text, icon_1 , icon_2 , icon_3 }, i) => (
            <motion.div key={year} custom={i + 1} variants={fadeIn} className="mb-4 ml-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md flex items-center gap-4">
              <div className="w-auto h-10 flex flex-row items-center -space-x-1.5">
                <Image src={icon_1} alt={`${year} icon`} width={35} height={35} className="dark:invert" />
                <Image src={icon_2} alt={`${year} icon`} width={35} height={35} className="dark:invert" />
                <Image src={icon_3} alt={`${year} icon`} width={35} height={35} className="dark:invert" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{year}</h3>
                <p className="text-gray-700 dark:text-gray-300">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <Link href='/about'>
          <Button className='cursor-pointer hover:scale-110'>View Full Journey</Button>
          </Link>
        </div>
      </motion.section>

      {/* Micro Projects Preview */}
      <motion.section className="mt-35" initial="hidden" whileInView="visible">
        <motion.h2 custom={9} variants={fadeIn} className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          Featured Projects
        </motion.h2>
        <motion.div custom={10} variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectDes.map((project) => (
            <motion.div
              key={project.projectNo}
              whileHover={{ scale: 1.01 }}
              className="rounded-xl bg-white dark:bg-gray-900 border-none p-5 shadow dark:shadow-blue-900 hover:shadow-md dark:hover:shadow-blue-700 transition"
            >
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{project.projectTitle}</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">Short description of what the {project.projectTitle}.</p>
              <Button size="sm" className='cursor-pointer' >Live Demo</Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Developer Values */}
      <motion.section className="mt-40" initial="hidden" whileInView="visible">
        <motion.h2 custom={11} variants={fadeIn} className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          How I Work
        </motion.h2>
        <motion.div className="grid md:grid-cols-2 gap-6">
          {pointOnWork.map(({title, description}, i) => (
            <motion.div key={title} custom={i + 1} variants={fadeIn} className="bg-gradient-to-r from-blue-100 to-blue-150 dark:from-black dark:to-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md dark:shadow-blue-700 border-none hover:border-blue-300 dark:border-blue-700">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">{title}</h3>
              <p className="text-md text-blue-800 dark:text-blue-200">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Final CTA */}
      <motion.section className="mt-32 text-center max-w-4xl mx-auto px-6" initial="hidden" whileInView="visible">
        <motion.h2 custom={12} variants={fadeIn} className="text-5xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">
          Let's Build the Future of Technology Together
        </motion.h2>
        <motion.p custom={13} variants={fadeIn} className="text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          I am eager to work in TOP-TECH Giants && bring my expertise in full-stack development, scalable systems, and cutting-edge technologies to a leading tech company. Let's collaborate to create innovative solutions that drive impact and excellence.
        </motion.p>
        <motion.div custom={14} variants={fadeIn} className="flex justify-center gap-6">
          <Link href='/contact-dev'>
           <Button className="rounded-xl px-8 py-4 text-lg font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-shadow shadow-lg">
             Contact Me
           </Button>
          </Link>
          <Link href='https://github.com/billionaireRai'>
            <Button variant="outline" className="text-blue-600 border-none dark:text-blue-400 text-lg flex gap-2 items-center cursor-pointer hover:bg-blue-100 dark:bg-black dark:hover:bg-gray-900 transition">
              <Image src={GitHubLogoIcon} width={24} height={24} alt="GitHub Icon" className="dark:invert"/>
              View My GitHub
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      <div className="my-40"></div>
    </main>
  );
}
