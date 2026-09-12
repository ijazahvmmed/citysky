import { img, type ImageRef } from "../images";

export interface Person {
  name: string;
  role: string;
  portrait: ImageRef;
}

export const team: Person[] = [
  { name: "Arjun Menon", role: "Founder, Principal Architect", portrait: img("1507003211169-0a1dd7228f2d", "Portrait of Arjun Menon") },
  { name: "Lakshmi Nair", role: "Director, Interiors", portrait: img("1494790108377-be9c29b29330", "Portrait of Lakshmi Nair") },
  { name: "Thomas Kurian", role: "Head of Construction", portrait: img("1500648767791-00dcc994a43e", "Portrait of Thomas Kurian") },
  { name: "Meera Pillai", role: "Project Architect", portrait: img("1438761681033-6461ffad8d80", "Portrait of Meera Pillai") },
  { name: "Rahul Varma", role: "Structural Engineer", portrait: img("1472099645785-5658abf4ff4e", "Portrait of Rahul Varma") },
  { name: "Anjali Joseph", role: "Client Relations", portrait: img("1531123897727-8f129e1688ce", "Portrait of Anjali Joseph") },
];
