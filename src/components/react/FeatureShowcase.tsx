import { motion } from 'motion/react';
import { BarChart3, Shield, Headphones, MonitorCheck, Camera, Network, Map } from 'lucide-react';

// import warehouseImg from '@assets/photo-1553413077-190dd305871c.jpg';
// import truckImg from '@assets/photo-1601584115197-04ecc0da31d7.jpg';
// import packageImg from '@assets/photo-1581091226825-a6a2a5aee158.jpg';
// import barChart3Img from '@assets/photo-1551288049-bebda4e38f71.jpg';
// import shieldImg from '@assets/photo-1563013544-824ae1b704d3.jpg';
// import headphonesImg from '@assets/photo-1486312338219-ce68d2c6f44d.jpg';
import bgSample from '@assets/background-hero-lantar.jpg'

const features = [
  {
    icon: MonitorCheck,
    title: 'Software Development',
    description: 'Provides development and support to information systems, based on the needs collected and documented by the system analyst.',
    image: bgSample,
  },
  {
    icon: Camera,
    title: 'Multimedia Production',
    description: 'Providing support for innovation and creation of multimedia content services in various forms to facilitate the delivery of information.',
    image: bgSample,
  },
  {
    icon: Map,
    title: 'Engineering Design and Mapping',
    description: 'Provides support for the creation of engineering design and mapping services to support the development of information systems.',
    image: bgSample,
  },
  {
    icon: BarChart3,
    title: 'Graphics Design',
    description: 'Our creations are designed to convey your company’s unique personality and attract those who believe in the same vision as you.',
    image: bgSample,
  },
  {
    icon: Shield,
    title: 'Technology Consulting',
    description: 'Helps Advise Clients How To Best Use IT Practices To Achieve Their Business Goals By Managing And Implementing Strategies.',
    image: bgSample,
  },
  {
    icon: Network,
    title: 'Networking Server',
    description: 'Provides computer network communication support to ensure smooth operation and maximum performance for information system users.',
    image: bgSample,
  },
];

export default function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={feature.image.src}
                alt={feature.title}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />
              
              {/* Icon overlay */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="absolute top-4 right-4 w-12 h-12 bg-[#A9CE3C] rounded-lg flex items-center justify-center shadow-lg"
              >
                <feature.icon className="w-6 h-6 text-slate-600" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-200 opacity-90">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

