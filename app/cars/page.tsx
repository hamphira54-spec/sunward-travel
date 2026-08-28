import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CarSearchForm from '@/components/cars/CarSearchForm';
import TipsContent from '@/components/category/TipsContent';
import { Clock, MapPin, Shield, CreditCard, Star, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Car Rentals Worldwide — Sunward Travel',
  description:
    'Search and compare car rental deals worldwide. Find the best rates from Rentalcars, Kayak, DiscoverCars and more — all in one place on Sunward Travel.',
};

const CAR_TIPS = [
  {
    icon: Clock,
    heading: 'Book at least 2 weeks ahead for the best rates',
    body: 'Car rental prices fluctuate like airline tickets. Booking early locks in lower rates, especially for popular destinations in peak season.',
  },
  {
    icon: MapPin,
    heading: 'Airport rentals vs city-centre pick-up',
    body: 'Airport locations are convenient but often carry a 10–20% surcharge. If your hotel is central, consider picking up from a city-centre office instead.',
  },
  {
    icon: Shield,
    heading: 'Understand insurance before you click pay',
    body: 'Rental companies push expensive daily insurance add-ons. Check if your credit card or travel insurance already covers collision damage — most premium cards do.',
  },
  {
    icon: CreditCard,
    heading: 'Use a credit card, not a debit card',
    body: 'Most rental companies require a credit card for the security deposit. Using a debit card can result in a large hold on your account for several weeks.',
  },
  {
    icon: Star,
    heading: 'Book the smallest category you need',
    body: "You can often upgrade on arrival if larger cars are over-supplied. Booking economy saves money — upgrading is free or cheap at the desk.",
  },
  {
    icon: FileText,
    heading: 'Read the fine print on mileage limits',
    body: 'Some "unlimited mileage" deals have hidden caps. If you are doing a long road trip, verify the mileage policy before collecting the keys.',
  },
];

export default function CarsPage() {
  return (
    <>
      <CategoryHero
        title="Search & Compare Car Rentals"
        subtitle="Find the best rental rates from top providers worldwide — pick up at airports, city centres, and 50,000+ locations."
        imageUrl="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80"
        imageAlt="Modern rental car parked at scenic coastal road"
        tab="cars"
      />

      <section className="py-12 px-4 bg-sand">
        <CarSearchForm />
      </section>

      <div className="pt-16">
        <TipsContent
          heading="How to get the best car rental deal"
          intro="Car rentals are one of the most over-charged parts of travel — but a few simple habits can save you 30–50% versus booking blind."
          tips={CAR_TIPS}
        />
      </div>
    </>
  );
}
