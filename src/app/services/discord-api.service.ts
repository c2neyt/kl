import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Profile } from '../models/discord-profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscordApiService {

  urlDiscordApi: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDiscordUser(id: string): Observable<Profile> {
    // API artık kullanılabilir değil, mock veri döndürelim
    const mockProfile: Profile = {
      user: {
        id: id,
        username: 'Juan VI Britannia',
        global_name: 'Juan VI Britannia',
        avatar: 'default_avatar',
        discriminator: '0',
        bio: 'Web Developer',
        public_flags: 0,
        flags: 0
      },
      user_profile: {
        bio: 'Web Developer',
        profile_effect: { id: '1' },
        theme_colors: [6052956, 6052956], // gri tonları
        pronouns: ''
      },
      connected_accounts: [
        { type: 'github', id: 'github_id', name: 'GitHub', verified: true },
        { type: 'spotify', id: 'spotify_id', name: 'Spotify', verified: true },
        { type: 'steam', id: 'steam_id', name: 'Steam', verified: true },
        { type: 'xbox', id: 'xbox_id', name: 'Xbox', verified: true }
      ]
    };
    
    return of(mockProfile);
  }
}
