'use client';

import React from 'react';
import { Event } from '@/types';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Ticket } from 'lucide-react';

interface EventCardProps {
  event: Event;
  isAttending: boolean;
  onRsvp: (event: Event) => void;
  onSelectBusiness?: (businessId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isAttending,
  onRsvp,
  onSelectBusiness,
}) => {
  return (
    <div className="bg-white dark:bg-[#202a23] rounded-2xl border border-slate-200 dark:border-[#304238] overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col group">
      {/* Event Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#17251d]/95 backdrop-blur-xs text-emerald-900 dark:text-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
          {event.category}
        </div>
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded-full">
          {event.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Date and Time Header */}
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{event.date}</span>
          <span>•</span>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300 font-normal">{event.time}</span>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Host Business */}
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <span>Hosted by:</span>
          <button
            onClick={() => onSelectBusiness && onSelectBusiness(event.businessId)}
            className="font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline text-left truncate"
          >
            {event.businessName}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Location & Neighborhood */}
        <div className="mt-3 flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Footer / RSVP */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">{event.rsvpCount}</span>
            <span className="text-slate-500">RSVPs</span>
          </div>

          <button
            onClick={() => onRsvp(event)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs ${
              isAttending
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {isAttending ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                <span>Attending ✓</span>
              </>
            ) : (
              <>
                <Ticket className="w-3.5 h-3.5" />
                <span>RSVP Spot</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
