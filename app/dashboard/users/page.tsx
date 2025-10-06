"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  MoreHorizontal, 
  Shield, 
  User, 
  Trash2, 
  Edit,
  UserCheck,
  UserX,
  Crown
} from "lucide-react"
import { getAllUsers, deleteUser, updateUserRole, updateUserStatus } from "@/redux/actions/userActions"
// import toast from "react-hot-toast"

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
  const { user: currentUser } = useSelector((state: any) => state.user)
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    // Only fetch users if user is admin
    if (currentUser?.role === 'admin') {
      fetchUsers()
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter, currentUser?.role])

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
    try {
      setLoading(true)
      const params: any = {
        page: currentPage.toString(),
        limit: "10"
      }
      
      if (searchTerm) params.search = searchTerm
      if (roleFilter !== "all") params.role = roleFilter
      if (statusFilter !== "all") params.status = statusFilter

      const result = await dispatch(getAllUsers(params) as any)
      
      if (result.payload?.success) {
        setUsers(result.payload.users)
        setTotalPages(result.payload.pagination.totalPages)
      } else {
        alert("Kullanıcılar yüklenirken hata oluştu")
      }
    } catch (error) {
      alert("Kullanıcılar yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const result = await dispatch(deleteUser(userToDelete._id) as any)
      
      if (result.payload?.success) {
        alert("Kullanıcı başarıyla silindi")
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        fetchUsers()
      } else {
        alert(result.payload || "Kullanıcı silinirken hata oluştu")
      }
    } catch (error) {
      alert("Kullanıcı silinirken hata oluştu")
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const result = await dispatch(updateUserRole({ id: userId, role: newRole }) as any)
      
      if (result.payload?.success) {
        alert("Kullanıcı rolü başarıyla güncellendi")
        fetchUsers()
      } else {
        alert(result.payload || "Rol güncellenirken hata oluştu")
      }
    } catch (error) {
      alert("Rol güncellenirken hata oluştu")
    }
  }

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const result = await dispatch(updateUserStatus({ id: userId, status: newStatus }) as any)
      
      if (result.payload?.success) {
        alert("Kullanıcı durumu başarıyla güncellendi")
        fetchUsers()
      } else {
        alert(result.payload || "Durum güncellenirken hata oluştu")
      }
    } catch (error) {
      alert("Durum güncellenirken hata oluştu")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'user':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">
            Sistemdeki tüm kullanıcıları yönetin ve düzenleyin
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
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
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-[180px] h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="user">Kullanıcı</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-[180px] h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile?.picture} />
                      <AvatarFallback>
                        {user.name.charAt(0)}{user.surname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{user.name} {user.surname}</h3>
                        {!user.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            Doğrulanmamış
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {getRoleIcon(user.role)}
                          <span className="ml-1">
                            {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                          </span>
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                          {user.status === 'active' ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Pasif
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Role Update */}
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      disabled={user._id === currentUser._id}
                      className="w-[120px] h-8 px-2 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Status Update */}
                    <select
                      value={user.status}
                      onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                      disabled={user._id === currentUser._id}
                      className="w-[120px] h-8 px-2 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setUserToDelete(user)
                            setDeleteDialogOpen(true)
                          }}
                          disabled={user._id === currentUser._id}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Kullanıcı bulunamadı</h3>
                  <p className="text-muted-foreground">
                    Arama kriterlerinize uygun kullanıcı bulunamadı.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Sayfa {currentPage} / {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcıyı Sil</DialogTitle>
            <DialogDescription>
              <strong>{userToDelete?.name} {userToDelete?.surname}</strong> kullanıcısını silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz ve kullanıcının tüm verileri kalıcı olarak silinecektir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
