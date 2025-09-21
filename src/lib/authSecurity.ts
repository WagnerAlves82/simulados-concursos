import { createClient } from '@/lib/supabase';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserPermissions {
  canViewAdmin: boolean;
  canCreateQuestoes: boolean;
  canEditQuestoes: boolean;
  canDeleteQuestoes: boolean;
  canManageCargos: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canUploadBulk: boolean;
}

export class AuthSecurityService {
  private supabase = createClient();

  /**
   * Verificar se usuário é admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data } = await this.supabase
        .from('profiles')
        .select('plano, email')
        .eq('id', userId)
        .single();

      // Verificar se é super admin (seu email)
      if (data?.email === 'wagnerjuniorsouza@gmail.com') {
        return true;
      }

      // Verificar se tem plano admin
      return data?.plano === 'admin' || data?.plano === 'superadmin';

    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }
  }

  /**
   * Obter role do usuário
   */
  async getUserRole(userId: string): Promise<UserRole> {
    try {
      const { data } = await this.supabase
        .from('profiles')
        .select('plano, email')
        .eq('id', userId)
        .single();

      // Super admin (você)
      if (data?.email === 'wagnerjuniorsouza@gmail.com') {
        return 'superadmin';
      }

      // Verificar plano
      if (data?.plano === 'admin' || data?.plano === 'superadmin') {
        return 'admin';
      }

      return 'user';

    } catch (error) {
      console.error('Erro ao obter role:', error);
      return 'user';
    }
  }

  /**
   * Obter permissões do usuário
   */
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    const role = await this.getUserRole(userId);

    const permissions: Record<UserRole, UserPermissions> = {
      user: {
        canViewAdmin: false,
        canCreateQuestoes: false,
        canEditQuestoes: false,
        canDeleteQuestoes: false,
        canManageCargos: false,
        canManageUsers: false,
        canExportData: false,
        canUploadBulk: false,
      },
      admin: {
        canViewAdmin: true,
        canCreateQuestoes: true,
        canEditQuestoes: true,
        canDeleteQuestoes: false, // Apenas superadmin pode deletar
        canManageCargos: true,
        canManageUsers: false, // Apenas superadmin
        canExportData: true,
        canUploadBulk: true,
      },
      superadmin: {
        canViewAdmin: true,
        canCreateQuestoes: true,
        canEditQuestoes: true,
        canDeleteQuestoes: true,
        canManageCargos: true,
        canManageUsers: true,
        canExportData: true,
        canUploadBulk: true,
      }
    };

    return permissions[role];
  }

  /**
   * Promover usuário para admin
   */
  async promoverUsuario(userEmail: string, novoPlano: 'admin' | 'superadmin' = 'admin'): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update({ plano: novoPlano })
        .eq('email', userEmail);

      if (error) throw error;
      return true;

    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      return false;
    }
  }

  /**
   * Remover privilégios de admin
   */
  async removerAdmin(userEmail: string): Promise<boolean> {
    try {
      // Não permitir remover o próprio super admin
      if (userEmail === 'wagnerjuniorsouza@gmail.com') {
        throw new Error('Não é possível remover privilégios do super admin');
      }

      const { error } = await this.supabase
        .from('profiles')
        .update({ plano: 'gratuito' })
        .eq('email', userEmail);

      if (error) throw error;
      return true;

    } catch (error) {
      console.error('Erro ao remover admin:', error);
      return false;
    }
  }

  /**
   * Listar todos os usuários com suas roles
   */
  async listarUsuarios() {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, email, nome, plano, created_at, ultimo_acesso')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(user => ({
        ...user,
        role: user.email === 'wagnerjuniorsouza@gmail.com' 
          ? 'superadmin' 
          : (user.plano === 'admin' || user.plano === 'superadmin') 
            ? 'admin' 
            : 'user'
      })) || [];

    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }

  /**
   * Log de ações administrativas
   */
  async logAction(userId: string, action: string, details?: any) {
    try {
      await this.supabase
        .from('admin_logs')
        .insert({
          user_id: userId,
          action,
          details: details ? JSON.stringify(details) : null,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  }
}

// Hook para usar as permissões
export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = useMemo(() => new AuthSecurityService(), []);

  const checkPermissions = useCallback(async (userId: string) => {
    try {
      const userPermissions = await authService.getUserPermissions(userId);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  }, [authService]);

  return {
    permissions,
    loading,
    checkPermissions,
    authService
  };
}