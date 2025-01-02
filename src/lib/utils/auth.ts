import { generatePasswordResetToken } from '$lib/drizzle/postgres/models/tokens';
import { getUserProfileData } from '$lib/drizzle/postgres/models/users';
import { sendEmail } from '$lib/emails/send';
import { getFeedbackObjects, type Feedback } from '$lib/utils/utils';
import { fail, type ActionFailure } from '@sveltejs/kit';


export const AuthUtils = {
  sendPasswordResetLink: async (appUrl: string, email: string, userId: string): Promise<ActionFailure<{
    feedbacks: Feedback[];
  }> | void> => {
    const profile = await getUserProfileData(userId);
  
    try {
      const resetToken = await generatePasswordResetToken(userId);
  
      const fromAddress = process.env.FROM_EMAIL || 'donotreply@stacks.hoyt.services';
      const sender = `Stacks <${fromAddress}>`;
      const recipient = profile?.firstName ? `${profile.firstName}` : email;
      const emailHtml = `Hello ${recipient},<br><br>Here is your password reset link:<br><br><a href="${appUrl}/password-reset/${resetToken}">Reset Password</a><br><br>Thanks,<br>Drew from Stacks`;
  
      const passwordResetEmail = await sendEmail({
        from: sender,
        to: email as string,
        subject: 'Password Reset',
        html: emailHtml
      });
  
      if (passwordResetEmail[0].type === 'error') {
        return fail(500, {
          feedbacks: passwordResetEmail
        });
      }
    } catch (error) {
      const feedbacks = getFeedbackObjects([
        {
          type: 'error',
          title: 'Error sending email',
          message: 'An unknown error occurred while sending the email. Please try again later.'
        }
      ]);
  
      return fail(500, {
        feedbacks
      });
    }
  },
}