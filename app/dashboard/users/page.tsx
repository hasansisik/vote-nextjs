"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  Shield, 
  User, 
  Trash2,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  Filter,
  Calendar
} from "lucide-react"
import { getAllUsers, deleteUser, updateUserRole, updateUserStatus, clearError } from "@/redux/actions/userActions"
import { toast } from "sonner"

interface User {
  _id: string
  name: string
  surname: string
  email: string
  role: string
  status: string
  isVerified: boolean
  createdAt: string
  profile?: {
    picture?: string
  }
}

export default function UsersPage() {
  const dispatch = useDispatch()
  const { 
    user: currentUser, 
    allUsers, 
    userPagination,
    usersLoading, 
    usersError, 
    message 
  } = useSelector((state: any) => state.user)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const lastMessageRef = useRef<string | null>(null)

  useEffect(() => {
    // Only fetch users if user is admin
    if (currentUser?.role === 'admin') {
      fetchUsers()
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter, currentUser?.role])

  // Handle messages and errors
  useEffect(() => {
    if (message && message !== lastMessageRef.current) {
      lastMessageRef.current = message
      toast.success(message)
      // Clear message after a short delay to ensure toast is shown
      setTimeout(() => {
        dispatch(clearError() as any)
      }, 50)
    }
    if (usersError && usersError !== lastMessageRef.current) {
      lastMessageRef.current = usersError
      toast.error(usersError)
      // Clear error after a short delay to ensure toast is shown
      setTimeout(() => {
        dispatch(clearError() as any)
      }, 50)
    }
  }, [message, usersError, dispatch])

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Yetki Gerekli</h2>
          <p className="text-muted-foreground">Bu sayfaya erişim için admin yetkisi gereklidir.</p>
        </div>
      </div>
    )
  }

  const fetchUsers = async () => {
    const params: any = {
      page: currentPage.toString(),
      limit: "10"
    }
    
    if (searchTerm) params.search = searchTerm
    if (roleFilter !== "all") params.role = roleFilter
    if (statusFilter !== "all") params.status = statusFilter

    await dispatch(getAllUsers(params) as any)
  }


  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const result = await dispatch(deleteUser(userToDelete._id) as any)
      
      if (result.type.endsWith('/fulfilled')) {
        // Don't show toast here - it will be handled by the message effect
        setUserToDelete(null)
        fetchUsers()
      } else {
        toast.error(result.payload || "Kullanıcı silinirken hata oluştu")
      }
    } catch (error) {
      toast.error("Kullanıcı silinirken hata oluştu")
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setIsUpdating(userId)
    try {
      const result = await dispatch(updateUserRole({ id: userId, role: newRole }) as any)
      
      if (result.type.endsWith('/fulfilled')) {
        // Don't show toast here - it will be handled by the message effect
        // fetchUsers() // Remove this to prevent UI flickering
      } else {
        toast.error(result.payload || "Rol güncellenirken hata oluştu")
      }
    } catch (error) {
      toast.error("Rol güncellenirken hata oluştu")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    setIsUpdating(userId)
    try {
      const result = await dispatch(updateUserStatus({ id: userId, status: newStatus }) as any)
      
      if (result.type.endsWith('/fulfilled')) {
        // Don't show toast here - it will be handled by the message effect
        // fetchUsers() // Remove this to prevent UI flickering
      } else {
        toast.error(result.payload || "Durum güncellenirken hata oluştu")
      }
    } catch (error) {
      toast.error("Durum güncellenirken hata oluştu")
    } finally {
      setIsUpdating(null)
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">
            Sistemdeki tüm kullanıcıları yönetin ve düzenleyin
          </p>
        </div>
        <Button 
          onClick={fetchUsers} 
          variant="outline" 
          size="sm"
          disabled={usersLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${usersLoading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">Kullanıcı</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {usersLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Kullanıcılar yükleniyor...</p>
          </div>
        </div>
      ) : usersError ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-red-600">{usersError}</p>
            <Button 
              variant="outline" 
              onClick={fetchUsers}
              className="mt-2"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      ) : (!allUsers || allUsers.length === 0) ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kullanıcı bulunamadı</h3>
            <p className="text-muted-foreground">
              Arama kriterlerinize uygun kullanıcı bulunamadı.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-sidebar border-b border-gray-200">
              <tr>
                <th className="w-2/5 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="w-1/6 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="w-1/6 px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allUsers?.map((user: User) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={user.profile?.picture} />
                        <AvatarFallback className="rounded-lg">
                          {user.name.charAt(0)}{user.surname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name} {user.surname}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUpdateRole(user._id, value)}
                        disabled={user._id === currentUser._id || isUpdating === user._id}
                      >
                        <SelectTrigger className="w-[100px] h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Kullanıcı</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {isUpdating === user._id && (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.status}
                        onValueChange={(value) => handleUpdateStatus(user._id, value)}
                        disabled={user._id === currentUser._id || isUpdating === user._id}
                      >
                        <SelectTrigger className="w-[100px] h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Pasif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserToDelete(user)}
                            disabled={user._id === currentUser._id}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              <strong>{userToDelete?.name} {userToDelete?.surname}</strong> kullanıcısını silmek istediğinizden emin misiniz?
                              Bu işlem geri alınamaz ve kullanıcının tüm verileri kalıcı olarak silinecektir.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                              İptal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteUser}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {userPagination && userPagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Sayfa {currentPage} / {userPagination.totalPages}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || usersLoading}
            >
              Önceki
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, userPagination.totalPages))}
              disabled={currentPage === userPagination.totalPages || usersLoading}
            >
              Sonraki
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
