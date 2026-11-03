import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Shield,
  Trash2,
  UserPlus,
  UserX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
} from "../../../redux/features/user/userApi";
import { confirmDelete } from "../../Shared/confirmDelete";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import AddAdminForm from "./AddAdminForm";

export default function AdminManage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const queryPayload = useMemo(
    () => ({
      pagination: {
        pageSize,
        currentPage,
      },
      filter: { role: "admin" },
      select: {
        name: 1,
        username: 1,
        phoneNo: 1,
        profileImg: 1,
        role: 1,
        permissions: 1,
        addedBy: 1,
        pages: 1,
        createdAt: 1,
      },
      sort: {
        createdAt: -1,
      },
    }),
    [pageSize, currentPage],
  );

  const {
    data: adminsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminQuery(queryPayload);
  const [addAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  // Extract admins array safely across different possible API wrapper formats
  const adminsList: any[] = useMemo(() => {
    if (!adminsResponse) return [];
    if (Array.isArray(adminsResponse)) return adminsResponse;
    if (Array.isArray(adminsResponse?.data)) return adminsResponse.data;
    if (Array.isArray(adminsResponse?.data?.result))
      return adminsResponse.data.result;
    if (Array.isArray(adminsResponse?.data?.data))
      return adminsResponse.data.data;
    if (Array.isArray(adminsResponse?.result)) return adminsResponse.result;
    return [];
  }, [adminsResponse]);

  const totalCount =
    adminsResponse?.pagination?.total ||
    adminsResponse?.totalCount ||
    adminsResponse?.data?.total ||
    adminsList.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handleFormSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "ADMIN",
    };

    try {
      const response = await addAdmin(payload)?.unwrap();

      if (response?.success) {
        toast?.success(response?.message || "Admin created successfully");
        refetch();
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast?.error(error?.data?.message || "Failed to create admin");
      setIsModalOpen(false);
    }
  };

  const handleAdminDelete = async (adminId: string) => {
    const isConfirmed = await confirmDelete({
      title: "Delete Admin?",
      text: "This admin account will be permanently removed.",
    });

    if (!isConfirmed) return;

    try {
      await deleteAdmin(adminId)?.unwrap();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Admin has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while deleting.",
      });
    }
  };

  const renderAddedBy = (addedBy: any) => {
    if (!addedBy) return "-";
    if (typeof addedBy === "object") {
      return addedBy.name || addedBy.username || addedBy.email || "-";
    }
    return addedBy;
  };

  const renderPagesOrPermissions = (pages: any, permissions: any) => {
    const items =
      Array.isArray(pages) && pages.length > 0
        ? pages
        : Array.isArray(permissions) && permissions.length > 0
          ? permissions
          : [];

    if (items.length === 0)
      return <span className="text-gray-400 text-xs">None</span>;

    return (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {items.slice(0, 3).map((item: any, idx: number) => (
          <Badge
            key={idx}
            variant="secondary"
            className="text-[11px] bg-slate-100 text-slate-700"
          >
            {typeof item === "string"
              ? item
              : item.name || item.title || JSON.stringify(item)}
          </Badge>
        ))}
        {items.length > 3 && (
          <Badge variant="outline" className="text-[10px] text-gray-500">
            +{items.length - 3} more
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="p-5 space-y-4">
      <Card className="w-full border-none shadow-lg gap-0">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Admin Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage and monitor administrator accounts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Add Admin</DialogTitle>
                  </DialogHeader>
                  <AddAdminForm
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-t overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-700 text-sm pl-6">
                    Admin
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">
                    Pages / Permissions
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">
                    Added By
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">
                    Created At
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading || isFetching ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        <p className="text-sm">Loading admin data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : adminsList.length > 0 ? (
                  adminsList.map((admin: any, index: number) => {
                    const adminId = admin._id || admin.id;
                    const initials = admin.name
                      ? admin.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : admin.username
                        ? admin.username[0].toUpperCase()
                        : "A";

                    return (
                      <TableRow
                        key={adminId || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Admin Profile */}
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            {admin.profileImg ? (
                              <img
                                src={admin.profileImg}
                                alt={admin.name || admin.username}
                                className="w-10 h-10 rounded-full object-cover border"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {initials}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">
                                {admin.name || "N/A"}
                              </span>
                              {admin.username && (
                                <span className="text-xs text-gray-500">
                                  @{admin.username}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="flex flex-col gap-1 text-xs text-gray-600">
                            {admin.phoneNo && (
                              <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                <Phone size={13} className="text-gray-400" />
                                {admin.phoneNo}
                              </div>
                            )}
                            {admin.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail size={13} className="text-gray-400" />
                                {admin.email}
                              </div>
                            )}
                            {!admin.phoneNo && !admin.email && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 font-semibold border-purple-200">
                            <Shield className="w-3 h-3 mr-1" />
                            {admin.role || "ADMIN"}
                          </Badge>
                        </TableCell>

                        {/* Pages / Permissions */}
                        <TableCell>
                          {renderPagesOrPermissions(
                            admin.pages,
                            admin.permissions,
                          )}
                        </TableCell>

                        {/* Added By */}
                        <TableCell className="text-sm text-gray-600">
                          {renderAddedBy(admin.addedBy)}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className="text-xs text-gray-600">
                          {admin.createdAt ? (
                            <div className="flex items-center gap-1">
                              <Calendar size={13} className="text-gray-400" />
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="pr-6 text-right">
                          <Button
                            onClick={() => handleAdminDelete(adminId)}
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                            title="Delete Admin"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 py-10">
                        <UserX className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-700">
                          No data found
                        </p>
                        <p className="text-sm text-gray-400">
                          There are no administrator accounts available.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {adminsList.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
              <p className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage + 1 >= totalPages || isLoading}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
