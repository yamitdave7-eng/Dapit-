export interface Business {
  id: string;
  name: string;
  category: 'Café & Dining' | 'Retail & Goods' | 'Tech & Innovation' | 'Services & Trades' | 'Arts & Culture' | 'Wellness & Fitness';
  tagline: string;
  description: string;
  address: string;
  neighborhood: string;
  phone: string;
  email: string;
  website: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  openHours: string;
  tags: string[];
  hiringActive: boolean;
  activeJobsCount: number;
  activeEventsCount: number;
}

export interface Event {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  businessImage?: string;
  date: string;
  time: string;
  location: string;
  neighborhood: string;
  category: 'Workshop' | 'Networking' | 'Arts & Culture' | 'Social & Meetup' | 'Career Fair';
  description: string;
  image: string;
  price: string;
  rsvpCount: number;
  capacity: number;
  attendees: string[];
}

export interface Job {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  location: string;
  neighborhood: string;
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  jobType: 'Part-time' | 'Full-time' | 'Internship' | 'Contract';
  salaryRange: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  applicantsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  businessId: string;
  businessName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantRole: string;
  resumeSummary: string;
  portfolioUrl?: string;
  coverNote: string;
  status: 'Pending' | 'Reviewing' | 'Interviewing' | 'Accepted' | 'Rejected';
  appliedAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'Announcement' | 'Question' | 'Collaboration' | 'Local Recommendation';
  likes: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  likedByMe?: boolean;
}

export interface PublicMember {
  id: string;
  display_name: string;
  role: string;
  location: string;
  bio: string;
  avatar_url: string;
  following: boolean;
  friendStatus: 'none' | 'pending' | 'accepted' | 'incoming';
}

export interface TalentProfile {
  id: string;
  name: string;
  title: string;
  role: 'Student' | 'Recent Graduate' | 'Local Freelancer' | 'Career Changer';
  universityOrOrg: string;
  bio: string;
  skills: string[];
  lookingFor: string[];
  avatar: string;
  contactEmail: string;
  portfolioUrl?: string;
  isAvailable: boolean;
}

export type ActiveTab = 'all' | 'businesses' | 'events' | 'jobs' | 'talent' | 'community' | 'dashboard';

export type UserRole = 'student' | 'business_owner' | 'resident' | 'admin';
