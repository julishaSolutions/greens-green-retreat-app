
import { getPostById } from '@/services/postService';
import { notFound } from 'next/navigation';
import { EditForm } from './components/edit-form';

export default async function AdminJournalEditPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <EditForm post={post} />
    </div>
  );
}
