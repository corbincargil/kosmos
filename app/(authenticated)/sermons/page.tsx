import UploadSermon from "./_components/upload-sermon";

export default function Sermons() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Sermons</h2>
      <UploadSermon />
    </div>
  );
}
