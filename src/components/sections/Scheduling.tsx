"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = ["09:00", "10:00", "14:00", "15:30", "17:00"];

// Generate calendar days for demo
const generateDays = () => {
  const days = [];
  // Previous month filler
  days.push({ day: 29, disabled: true });
  days.push({ day: 30, disabled: true });

  // Current month days
  for (let i = 1; i <= 19; i++) {
    const isWeekend = [6, 7, 13, 14, 20, 21].includes(i);
    days.push({ day: i, disabled: isWeekend });
  }

  return days;
};

interface SchedulingProps {
  whatsappNumber?: string;
}

export function Scheduling({ whatsappNumber }: SchedulingProps) {
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = generateDays();
  const whatsapp = whatsappNumber || "5511999990123";

  const handleConfirm = () => {
    if (!selectedTime) {
      alert("Por favor, selecione um horário.");
      return;
    }

    const message = `Olá! Gostaria de agendar uma consulta para o dia ${selectedDay} de Outubro às ${selectedTime}.`;
    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="agendamento" className="py-20 bg-brand-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Agende sua Sessão
          </h2>
          <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full" />
          <p className="mt-4 text-gray-600">
            Selecione o melhor dia e horário para iniciarmos nossa conversa.
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Calendar Side */}
          <div className="p-8 md:w-2/3 border-r border-gray-100">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Outubro 2023</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-bold text-gray-400 uppercase">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sab</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {days.map((item, index) => (
                <button
                  key={index}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      setSelectedDay(item.day);
                      setSelectedTime(null);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    item.disabled
                      ? "text-brand-200 line-through cursor-not-allowed"
                      : selectedDay === item.day
                      ? "bg-brand-500 text-white font-bold shadow-md"
                      : "text-gray-700 hover:bg-brand-50"
                  }`}
                >
                  {item.day}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Dia Selecionado
            </p>
          </div>

          {/* Time Slots Side */}
          <div className="p-8 md:w-1/3 bg-gray-50 flex flex-col">
            <h4 className="font-bold text-gray-900 mb-4">
              Horários Disponíveis
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Para {selectedDay} de Outubro
            </p>

            <div className="space-y-3 flex-grow overflow-y-auto max-h-60">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white border border-brand-200 text-brand-700 hover:border-brand-500 hover:bg-brand-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 transition-colors shadow-md text-sm"
            >
              Confirmar Horário
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
