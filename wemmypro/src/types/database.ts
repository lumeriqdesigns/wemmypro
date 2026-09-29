export type BookingStatus = "inquiry" | "confirmed" | "completed" | "cancelled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export type Gallery = {
  id: string;
  client_id: string | null;
  title: string;
  event_date: string | null;
  cover_photo_url: string | null;
  slug: string;
  password_hash: string | null;
  expires_at: string | null;
  is_published: boolean;
  allow_downloads: boolean;
  max_downloads: number | null;
  watermark_previews: boolean;
  created_at: string;
};

export type Photo = {
  id: string;
  gallery_id: string;
  storage_path: string;
  thumbnail_path: string | null;
  position: number;
  created_at: string;
};

export type Booking = {
  id: string;
  client_id: string | null;
  gallery_id: string | null;
  title: string | null;
  event_date: string | null;
  location: string | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
};

export type InvoiceLineItem = {
  description: string;
  qty: number;
  unit_price: number;
};

export type Invoice = {
  id: string;
  client_id: string | null;
  booking_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  line_items: InvoiceLineItem[];
  amount_total: number;
  currency: string;
  due_date: string | null;
  created_at: string;
};
