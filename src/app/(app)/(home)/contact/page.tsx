import Image from "next/image"
import { Mail } from "lucide-react"
import { SiGithub, SiLinkedin } from "react-icons/si"

export default function Contact() {
  return (
    <div className="prose max-w-3xl mx-auto p-6 text-center">
      {/* Profile Photo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/profile.jpg"
          alt="J Sriprashant"
          width={150}
          height={150}
          className="rounded-full shadow-lg"
        />
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold mb-2">J Sriprashant</h1>
      <p className="text-gray-600 mb-4">
        Bangalore, Karnataka | B.Tech CSE 
      </p>

      {/* About Me */}
      <p className="mb-6">
        I am someone who commits fully on a task and ensures its completion, even if
        it involves learning new technologies. I am a quick learner and able to adapt
        to changes and challenges with ease.
      </p>

      {/* Contact Info */}
      <div className="flex justify-center space-x-6 mb-8">
        <a
          href="mailto:jsriprashant567@gmail.com"
          className="flex items-center space-x-2 text-blue-600 hover:underline"
        >
          <Mail size={20} /> <span>jsriprashant567@gmail.com</span>
        </a>
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-6">
        <a
          href="https://github.com/Jsriprashant"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-800 hover:text-black"
        >
          <SiGithub size={20} /> <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/jsriprashant/" // replace with your actual LinkedIn
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-700 hover:underline"
        >
          <SiLinkedin size={20} /> <span>LinkedIn</span>
        </a>
      </div>

    </div>
  )
}
