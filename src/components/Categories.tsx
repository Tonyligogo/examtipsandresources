import { useNavigate } from "react-router-dom"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Stethoscope,
  Pill,
  Brain,
  Baby,
  Heart,
  FlaskConical,
  Bone,
  ShieldPlus,
  Sparkles,
} from "lucide-react"

interface Category {
  id: number
  title: string
  subject: string
  description: string
  icon: React.ElementType
}

const categories: Category[] = [
  {
    id: 1,
    title: "Pharmacology",
    subject: "Pharmacology",
    description: "Drug classifications, mechanisms of action, and medication safety for nurses.",
    icon: Pill,
  },
  {
    id: 2,
    title: "Anatomy & Physiology",
    subject: "Anatomy",
    description: "Master the human body's structure and systems from head to toe.",
    icon: Bone,
  },
  {
    id: 3,
    title: "Medical-Surgical",
    subject: "Medical-Surgical",
    description: "Core concepts for adult health nursing and perioperative care.",
    icon: Stethoscope,
  },
  {
    id: 4,
    title: "Mental Health",
    subject: "Mental Health",
    description: "Psychiatric nursing, therapeutic communication, and crisis intervention.",
    icon: Brain,
  },
  {
    id: 5,
    title: "Maternal & Child",
    subject: "Maternal",
    description: "Obstetric, neonatal, and pediatric nursing essentials.",
    icon: Baby,
  },
  {
    id: 6,
    title: "Cardiology",
    subject: "Cardiology",
    description: "ECG interpretation, cardiac conditions, and cardiovascular care.",
    icon: Heart,
  },
  {
    id: 7,
    title: "Pathophysiology",
    subject: "Pathophysiology",
    description: "Understand disease processes and how they affect body function.",
    icon: FlaskConical,
  },
  {
    id: 8,
    title: "Critical Care",
    subject: "Critical Care",
    description: "ICU nursing, ventilator management, and emergency response.",
    icon: ShieldPlus,
  },
]

export default function CourseCategoriesSection() {
  const navigate = useNavigate()

  const handleCategoryClick = (subject: string) => {
    navigate(`/catalog?subject=${encodeURIComponent(subject)}`)
  }

  return (
    <section className="w-full py-12 sm:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#E8651A]" />
            <span className="text-sm font-semibold text-[#E8651A]">
              Study Categories
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Browse by Nursing Subject
          </h2>

          <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
            Find revision materials for every core nursing module — from pharmacology to critical care.
          </p>
        </div>

        {/* Carousel — extra horizontal padding makes room for the arrow buttons */}
        <div className="relative lg:px-12">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-3">
              {categories.map((category) => {
                const Icon = category.icon

                return (
                  <CarouselItem
                    key={category.id}
                    className="pl-3 basis-4/5 sm:basis-1/2 lg:basis-1/4"
                  >
                    <button
                      onClick={() => handleCategoryClick(category.subject)}
                      className="group w-full rounded-2xl p-6 sm:p-8 text-center transition-all duration-300
                        bg-orange-50 hover:bg-[#E8651A] hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex justify-center mb-4">
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 group-hover:text-white transition-colors duration-300" />
                      </div>

                      <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 group-hover:text-white transition-colors duration-300">
                        {category.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300">
                        {category.description}
                      </p>
                    </button>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            {/* Buttons sit inside the px-10 wrapper so they're always visible */}
            <CarouselPrevious className="left-0 bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-[#E8651A] hover:text-white hover:border-[#E8651A] transition-colors" />
            <CarouselNext className="right-0 bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-[#E8651A] hover:text-white hover:border-[#E8651A] transition-colors" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}