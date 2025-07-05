/**
 * About Us Page Component
 * Displays company mission, team bios, and company information
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, Linkedin, Twitter, Github } from 'lucide-react';
import StartProjectModal from '../StartProjectModal';
import { useAuth } from '../../hooks/useAuth';

const AboutPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showTeamSection, setShowTeamSection] = React.useState(true); // This would be controlled by admin
  const { user } = useAuth();

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former Google AI researcher with 10+ years in neural networks and machine learning. Passionate about democratizing AI for businesses.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      bio: 'Full-stack architect specializing in scalable AI systems. Previously led engineering teams at Tesla and SpaceX.',
      image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Emily Watson',
      role: 'Head of Design',
      bio: 'Award-winning UX designer with expertise in neural interface design. Creates intuitive experiences that bridge human and AI interaction.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'David Kim',
      role: 'AI Research Lead',
      bio: 'PhD in Computer Science from MIT. Specializes in natural language processing and computer vision applications for business.',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI and neural networks to create breakthrough solutions.'
    },
    {
      icon: Users,
      title: 'Human-Centered',
      description: 'Technology should enhance human capabilities, not replace them. We design AI that empowers people.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do, from code quality to customer service.'
    },
    {
      icon: Heart,
      title: 'Ethical AI',
      description: 'We believe in responsible AI development that considers privacy, fairness, and societal impact.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 relative">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Thinkzo
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're a team of AI researchers, engineers, and designers on a mission to make 
              intelligent technology accessible to every business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                At Thinkzo, we believe that artificial intelligence should be a force for 
                human empowerment, not replacement. Our mission is to democratize AI technology 
                by creating intelligent solutions that are accessible, ethical, and transformative.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                We envision a future where every business, regardless of size or technical 
                expertise, can harness the power of neural networks to solve complex problems, 
                enhance creativity, and drive innovation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team collaboration"
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-1">50+</div>
                    <div className="text-slate-400 text-sm">Projects Completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-400 mb-1">25+</div>
                    <div className="text-slate-400 text-sm">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-lime-400 mb-1">3</div>
                    <div className="text-slate-400 text-sm">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">15+</div>
                    <div className="text-slate-400 text-sm">AI Models Deployed</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              These core principles guide everything we do and shape how we build the future of AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-purple-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {showTeamSection && (
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Meet Our Team</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                The brilliant minds behind Thinkzo's neural-powered solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-500/30"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <div className="text-purple-400 font-medium mb-4">{member.role}</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">{member.bio}</p>

                  <div className="flex justify-center space-x-3">
                    <a
                      href={member.social.linkedin}
                      className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all duration-300"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all duration-300"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href={member.social.github}
                      className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-400 hover:bg-slate-700 transition-all duration-300"
                    >
                      <Github size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join the Neural Revolution?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Let's work together to build intelligent solutions that transform your business.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/8 transition-all duration-300 border border-purple-500/20"
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>

    {/* Start Project Modal */}
    <StartProjectModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
  );
};

export default AboutPage;