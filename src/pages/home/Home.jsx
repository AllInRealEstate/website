import Hero from './Hero/Hero';
import About from './About/About';
import ProjectsPreview from './ProjectsPreview/ProjectsPreview'; 
import Services from './Services/Services';
//import Testimonials from './Testimonials/Testimonials';
import Reviews from './Reviews/Reviews';
import Contact from './Contact/Contact';
import { VideoProvider } from '../home/VideoContext';
import './Home.css';

const Home = () => {
  return (
    <VideoProvider>
      <div className="home-page">
        <Hero />
        <About />
        <ProjectsPreview /> 
        <Services />
        <Reviews />
        <Contact /> 
      </div>
    </VideoProvider>
  );
};

export default Home;