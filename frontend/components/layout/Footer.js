'use client';

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent('Hi Tvisaa!');
  const whatsupHref = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <footer className="bg-[#1E1008] text-[#D6C5B0] border-t border-[#3A2510] font-jost">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Brand */}
          <div className="max-w-lg">
            <Image
              src="/images/logo.png"
              alt="Tvisaa_for You"
              width={200}
              height={80}
              className="mb-6 sm:mb-8 w-20 sm:w-48 lg:w-28 h-auto bg-orange-200"
            />

            <p className="text-sm sm:text-base lg:text-[17px] leading-7 sm:leading-8 text-[#A89880]">
              Everyday luxury within reach. Premium stainless steel jewellery that is waterproof,
              tarnish-resistant, and made for effortless everyday wear.
            </p>

            <div className="mt-8 sm:mt-10 lg:mt-12 flex items-center gap-5 sm:gap-6 text-xl sm:text-2xl text-[#A89880]">
              <a
                href="https://www.instagram.com/tvisaa_foryou?utm_source=qr&igsh=eHF1Nm0xZ203bXJk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C8A96E] transition-colors duration-300"
              >
                <div className="flex flex-col items-center">
                  <FaInstagram />
                  <p className="text-sm mt-1">Instagram</p>
                </div>
              </a>

              <a
                href={whatsupHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C8A96E] transition-colors duration-300"
              >
                <div className="flex flex-col items-center">
                  <FaWhatsapp />
                  <p className="text-sm mt-1">What&apos;s Up</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Structured Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-8 sm:gap-y-10 lg:gap-y-14">

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#C8A96E]">
                Brand
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#A89880] flex flex-col">
                <Link href="/about-us/" className="hover:text-[#D6C5B0] transition-colors duration-300">About Us</Link>
                <Link href="/faqs/" className="hover:text-[#D6C5B0] transition-colors duration-300">FAQ&apos;s</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#C8A96E]">
                Care
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#A89880] flex flex-col">
                <Link href="/jewellery-care" className="hover:text-[#D6C5B0] transition-colors duration-300">Jewellery Care</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#C8A96E]">
                Customer Care
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#A89880] flex flex-col">
                <Link href="/shipping-delivery" className="hover:text-[#D6C5B0] transition-colors duration-300">Shipping &amp; Delivery</Link>
                <Link href="/cash-on-delivery" className="hover:text-[#D6C5B0] transition-colors duration-300">Cash on Delivery</Link>
                <Link href="/return-and-exchange" className="hover:text-[#D6C5B0] transition-colors duration-300">Return and Exchange</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 lg:mb-5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#C8A96E]">
                Legal
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-[15px] text-[#A89880] flex flex-col">
                <Link href="/privacy-policy" className="hover:text-[#D6C5B0] transition-colors duration-300">Privacy Policy</Link>
                <Link href="/shipping-policy" className="hover:text-[#D6C5B0] transition-colors duration-300">Shipping Policy</Link>
                <Link href="/terms-conditions" className="hover:text-[#D6C5B0] transition-colors duration-300">Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 border-t border-[#3A2510] pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] text-[#6B5A47]">
          <span>© 2026 Tvisaa_for You</span>
          <span className="max-w-full lg:text-right">
            Dispatch in 1–2 days · Delivery in 3–7 days · COD ₹99
          </span>
        </div>
      </div>
    </footer>
  );
}