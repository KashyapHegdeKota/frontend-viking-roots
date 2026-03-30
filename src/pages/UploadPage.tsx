import { DashboardNavbar } from '@/components/dashboard-navbar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import ImageUpload from '@/components/ImageUpload';
import GedcomUploader from '@/components/GedcomUploader';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardNavbar />
      <div className="mx-auto flex max-w-7xl">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-xl flex flex-col gap-8">
            <h1 className="text-2xl font-bold text-white">Upload</h1>
            <ImageUpload />
            <GedcomUploader />
          </div>
        </main>
      </div>
    </div>
  );
}
