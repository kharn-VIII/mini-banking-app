import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import toast from 'react-hot-toast';
import AuthCard from '../ux/AuthCard';
import EmailInput from '../entities/EmailInput';
import PasswordInput from '../entities/PasswordInput';
import Button from '../ux/Button';
import ErrorMessage from '../ux/ErrorMessage';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine(validateEmail, 'Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .refine(
      validatePassword,
      'Password must be between 6 and 32 characters',
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password).unwrap();
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <AuthCard title="Create your account">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm -space-y-px">
          <EmailInput
            {...register('email')}
            error={errors.email?.message}
            rounded="top"
          />
          <PasswordInput
            {...register('password')}
            error={errors.password?.message}
            rounded="bottom"
            autoComplete="new-password"
            placeholder="Password (6-32 characters)"
          />
        </div>

        <ErrorMessage message={error || undefined} />

        <div>
          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </div>

        <div className="text-sm text-center">
          <span className="text-slate-400">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-fuchsia-400 hover:text-fuchsia-300"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterForm;

