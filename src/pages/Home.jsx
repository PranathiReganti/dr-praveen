import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

import Hero            from '../sections/Hero'
import StatsCounter    from '../sections/StatsCounter'
import AboutPreview    from '../sections/AboutPreview'
import ServicesPreview from '../sections/ServicesPreview'
import ClinicsCard     from '../sections/ClinicsCard'
import QueuePreview    from './QueuePreview'
import ReviewsCarousel from '../sections/ReviewsCarousel'
import BlogPreview     from '../sections/BlogPreview'
import { DOCTOR }      from '../data/content'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{DOCTOR.name} | Endocrinology Specialist Yelahanka Bengaluru</title>
        <meta name="description" content={`${DOCTOR.name} — ${DOCTOR.tagline}. Expert care for Diabetes, Thyroid, PCOS and Hormonal disorders in Yelahanka, Bengaluru since 2011.`}/>
        <meta name="keywords" content="endocrinologist Yelahanka, diabetes doctor Bengaluru, thyroid specialist, PCOS treatment, Dr Praveen Ramachandra"/>
        <meta property="og:title" content={DOCTOR.name}/>
        <meta property="og:description" content={DOCTOR.tagline}/>
      </Helmet>

      {/* 🔥 Page Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >

        {/* Hero (fast entrance) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Hero/>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <StatsCounter/>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <AboutPreview/>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <ServicesPreview/>
        </motion.div>

        {/* Clinics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          <ClinicsCard/>
        </motion.div>

        {/* Queue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <QueuePreview/>
        </motion.div>

        

        {/* Blog */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <BlogPreview/>
        </motion.div>

      </motion.div>
    </>
  )
}