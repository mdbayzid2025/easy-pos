import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Shield, Lock, CheckCircle, Edit, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import {
  useGetLoggedInAdminDataQuery,
  useUpdateLoggedInAdminMutation,
  useUploadSingleImageMutation,
} from "../../../redux/features/user/userApi";
import { imageUrl } from "../../../redux/base/baseAPI";

const ProfilePage: React.FC = () => {
  const selectQuery = "name username role readOnly permissions profileImg";
  const { data: admin, isLoading, isError, refetch } = useGetLoggedInAdminDataQuery(selectQuery);
  const [updateLoggedInAdmin, { isLoading: isUpdating }] = useUpdateLoggedInAdminMutation();
  const [uploadSingleImage, { isLoading: isUploading }] = useUploadSingleImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    profileImg: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        username: admin.username || "",
        profileImg: admin.profileImg || "",
      });
    }
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadSingleImage(file).unwrap();
      // Handle response structure from uploadSingleImage (e.g. { url, filename, path })
      const uploadedUrl = res?.url || res?.path || res?.filename;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, profileImg: uploadedUrl }));
        toast.success("Profile image uploaded successfully!");
      } else {
        toast.error("Image uploaded but URL missing.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to upload image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Record<string, any> = {
        name: formData.name,
      };

      if (formData.profileImg) payload.profileImg = formData.profileImg;

      const res = await updateLoggedInAdmin(payload).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Profile updated successfully!");
        setIsEditing(false);
        refetch();
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "An error occurred while updating profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm font-medium">Loading admin profile...</p>
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200 m-6">
        <p className="font-semibold">Failed to load admin profile.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentImg = formData.profileImg || admin?.profileImg;
  const avatarSrc = currentImg
    ? currentImg.startsWith("http")
      ? currentImg
      : imageUrl + currentImg
    : "/default-avatar.png";

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" /> Admin Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your logged-in administrator account details.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isEditing
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-primary text-white hover:bg-primary/90 shadow-xs"
          }`}
        >
          {isEditing ? (
            <>Cancel Editing</>
          ) : (
            <>
              <Edit className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={avatarSrc}
              alt={admin?.name || "Admin Avatar"}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            {admin?.readOnly && (
              <span className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow-xs" title="Read Only Admin">
                <Lock className="w-4 h-4" />
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900">{admin?.name || "N/A"}</h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">@{admin?.username || "N/A"}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary font-semibold text-xs rounded-full uppercase tracking-wider">
              {admin?.role || "ADMIN"}
            </span>
            {admin?.readOnly ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-semibold text-xs rounded-full">
                Read Only
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-800 font-semibold text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Full Access
              </span>
            )}
          </div>

          {/* Permissions List */}
          <div className="w-full mt-6 pt-6 border-t border-gray-100 text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" /> Permissions ({admin?.permissions?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {admin?.permissions && admin.permissions.length > 0 ? (
                admin.permissions.map((perm: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No specific permissions assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details & Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs p-6">
          <h3 className="text-lg font-bold text-gray-900 pb-3 mb-6 border-b border-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {isEditing ? "Edit Account Information" : "Account Overview"}
          </h3>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username (Cannot be changed)
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm cursor-not-allowed outline-none"
                    placeholder="Username"
                  />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primary" /> Profile Photo Upload
                </label>
                
                <div className="flex items-center gap-4 mt-2">
                  <img
                    src={avatarSrc}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/default-avatar.png";
                    }}
                  />
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 cursor-pointer transition">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-primary" /> Uploading Image...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-primary" /> Choose Image File
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new photo (JPG, PNG, WEBP). Max size 10MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition shadow-xs disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Full Name
                  </span>
                  <span className="text-base font-semibold text-gray-800">
                    {admin?.name || "N/A"}
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Username
                  </span>
                  <span className="text-base font-semibold text-gray-800">
                    {admin?.username || "N/A"}
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Role
                  </span>
                  <span className="text-base font-semibold text-primary">
                    {admin?.role || "ADMIN"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  System Access & Permissions
                </span>
                <div className="flex flex-wrap gap-2">
                  {admin?.permissions?.map((perm: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-md shadow-2xs"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
