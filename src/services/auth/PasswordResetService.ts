```typescript
import { supabase } from '../supabase';

export class PasswordResetService {
  async sendResetLink(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) throw error;
  }

  async resetPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  }
}

export const passwordResetService = new PasswordResetService();
```