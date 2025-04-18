import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Profile } from '../models/discord-profile.model';
import { environment } from 'src/environments/environment';
import { LanyardService } from './lanyard.service';

@Injectable({
  providedIn: 'root'
})
export class DiscordApiService {
  // Direct Lanyard API URL for REST endpoints
  private lanyardApiUrl: string = 'https://api.lanyard.rest/v1';
  // Discord CDN URL için sabit değişkenler
  private discordCdnUrl: string = 'https://cdn.discordapp.com';
  private discordId: string = environment.discordId;

  constructor(private http: HttpClient, private lanyardService: LanyardService) { }

  getDiscordUser(id: string): Observable<Profile> {
    // Log user ID for debugging
    console.log('Fetching user with ID:', id);
    
    // Lanyard API kullanarak kullanıcı bilgilerini al
    return this.http.get<any>(`${this.lanyardApiUrl}/users/${id}`).pipe(
      map(lanyardData => {
        console.log('Lanyard data received:', lanyardData);
        
        // Response yapısını kontrol et
        if (!lanyardData || !lanyardData.data || !lanyardData.data.discord_user) {
          console.error('Invalid response format from Lanyard API');
          return this.getEmptyProfile(id);
        }
        
        // Lanyard verilerini Profile modeline dönüştür
        const discordUser = lanyardData.data.discord_user;
        const activities = lanyardData.data.activities || [];
        const discordStatus = lanyardData.data.discord_status;
        
        const profile: Profile = {
          user: {
            id: discordUser.id,
            username: discordUser.username || 'Unknown',
            global_name: discordUser.global_name || discordUser.username || 'Unknown',
            avatar: discordUser.avatar,
            discriminator: discordUser.discriminator || '0000',
            public_flags: discordUser.public_flags || 0,
            bio: '' // Lanyard doesn't provide this
          },
          user_profile: {
            bio: '', // Lanyard API biyografiyi doğrudan sağlamıyor
            pronouns: '', // Lanyard doesn't provide this
            theme_colors: [0x5C5C5C, 0x5C5C5C] // Default theme colors
          },
          badges: [], // We'll populate this with custom badges if needed
          connected_accounts: [] // Lanyard doesn't provide connected accounts
        };
        
        console.log('Converted profile:', profile);
        return profile;
      }),
      catchError(error => {
        console.error('Error fetching Discord user data:', error);
        // Hata durumunda boş profil objesi dön
        return of(this.getEmptyProfile(id));
      })
    );
  }

  // Avatar URL'sini hazırlar
  getAvatarUrl(userId: string, avatarHash?: string): string {
    // Kullanıcı avatar'ı varsa onu kullan
    if (avatarHash) {
      return `${this.discordCdnUrl}/avatars/${userId}/${avatarHash}.png`;
    }
    
    // Yoksa, default avatar kullan
    const defaultAvatarIndex = parseInt(userId.slice(-1)) % 5;
    return `${this.discordCdnUrl}/embed/avatars/${defaultAvatarIndex}.png`;
  }

  // Banner URL'sini hazırlar (eğer kullanıcıda banner yoksa boş string dönecek)
  getBannerUrl(userId: string): string {
    return ''; // Discord API'den banner url'sini özel erişim gerektirdiği için boş dönüyoruz
  }

  // Badge URL'sini hazırlar
  getBadgeUrl(badgeId: string): string {
    if (!badgeId) {
      return '../../../assets/images/no-image-found.png';
    }
    // Badge URL'lerini şimdilik sabit bir konumdan alıyoruz
    return `../../../assets/images/badges/${badgeId}.png`;
  }

  // Hata durumunda boş profil objesi oluşturur
  private getEmptyProfile(id: string): Profile {
    return {
      user: {
        id: id,
        username: 'User not found',
        global_name: 'User not found',
        avatar: '',
        discriminator: '0000',
        public_flags: 0
      },
      user_profile: {
        bio: '',
        pronouns: '',
        theme_colors: [0x5C5C5C, 0x5C5C5C]
      },
      badges: [],
      connected_accounts: []
    };
  }
}
