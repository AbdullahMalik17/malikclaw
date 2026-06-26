export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  verified: boolean; // must be true for real users only
  githubUser?: string;
}

export const testimonials: Testimonial[] = [
  // Add real testimonials here only when verified
  // Example structure (DO NOT add fake ones):
  // {
  //   quote: "...",
  //   author: "Real Name",
  //   role: "Real Role",
  //   verified: true,
  //   githubUser: "username"
  // }
];
