import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">EventHub</h2>
          <p className="text-sm leading-relaxed mb-4">
            Discover and create amazing events that bring people together.  
            Manage, publish, and share your events effortlessly.
          </p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-orange-500 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create/select" className="hover:text-orange-500 transition">
                Create Event
              </Link>
            </li>
            <li>
              <a href="#upcoming" className="hover:text-orange-500 transition">
                Upcoming Events
              </a>
            </li>
            <li>
              <a href="#categories" className="hover:text-orange-500 transition">
                Categories
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-500 transition">
                Terms & Privacy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-orange-500" />
              <span>123 Event Street, London, UK</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-orange-500" />
              <span>+44 20 1234 5678</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-orange-500" />
              <span>support@eventhub.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EventHub. All rights reserved.
      </div>
    </footer>
  );
}
