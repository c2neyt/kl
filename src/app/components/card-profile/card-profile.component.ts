import { Component, OnInit } from '@angular/core';
import { DiscordApiService } from 'src/app/services/discord-api.service';
import { Profile } from 'src/app/models/discord-profile.model';
import { LanyardService } from 'src/app/services/lanyard.service';
import { Lanyard, Activity } from 'src/app/models/lanyard-profile.model';
import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    loadAtropos(): void;
  }
}

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss']
})
export class CardProfileComponent implements OnInit {

  userId = environment.discordId;
  apiUrl = environment.apiUrl;
  userDataStatus = false;
  userData?: Profile;
  userBioFormatted?: string;
  themesColor: string[] = [];

  message = '';
  lanyardData!: Lanyard | null;
  lanyardActivities: Activity[] = [];
  statusColor: string = '#43b581'

  constructor(private discordApiService: DiscordApiService, private lanyardService: LanyardService) { }

  ngOnInit(): void {
    this.getDiscordUserData();
    this.getLanyardData();
  }

  public getDiscordUserData(): void {
    console.log('Getting Discord user data for ID:', this.userId);
    
    this.discordApiService.getDiscordUser(this.userId).subscribe({
      next: (data: Profile) => {
        console.log('Discord user data received:', data);
        this.userDataStatus = true;
        this.userData = data;

        // Change all the /n to <br>
        this.userBioFormatted = this.userData.user_profile?.bio?.replace(/\n/g, '<br>') || '';

        const themeColors = this.userData.user_profile?.theme_colors || [];
        if (themeColors.length === 0) {
          this.themesColor = ['#5C5C5C', '#5C5C5C'];
        } else {
          // Convert the decimal color to hex
          this.themesColor = themeColors.map((color) => {
            return '#' + color.toString(16).padStart(6, '0').toUpperCase();
          });
        }
      },
      error: (error) => {
        console.error('Error getting Discord user data:', error);
        this.userDataStatus = false;
      }
    }).add(() => {
      console.log('Discord user data request completed');
      window.loadAtropos();
    });
  }

  // Avatar URL'si için yardımcı metod
  public getAvatarUrl(): string {
    return this.discordApiService.getAvatarUrl(this.userId, this.userData?.user?.avatar);
  }

  // Banner URL'si için yardımcı metod
  public getBannerUrl(): string {
    if (!this.userData?.user?.banner) {
      return '';
    }
    return `https://cdn.discordapp.com/banners/${this.userId}/${this.userData.user.banner}.png`;
  }

  // Badge URL'si için yardımcı metod
  public getBadgeUrl(badgeId: string): string {
    return this.discordApiService.getBadgeUrl(badgeId);
  }

  public getLanyardData(): void {
    this.lanyardService.setupWebSocket();

    this.lanyardService.getLanyardData().subscribe({
      next: (data) => {
        this.lanyardData = data;

        this.lanyardActivities = this.lanyardData.d?.activities || [];

        // Format the timestamps of the activities
        this.lanyardActivities.forEach((activity) => {
          if (activity.timestamps) {
            const startTime = new Date(activity.timestamps.start || 0);
            const currentTime = new Date();
            const timeDifference = currentTime.getTime() - startTime.getTime();

            const hours = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            let timeAgoMessage = '';
            if (hours > 0) {
              timeAgoMessage += `${hours} ${hours === 1 ? 'saat' : 'saat'}`;
            }

            if (minutes > 0) {
              if (timeAgoMessage !== '') {
                timeAgoMessage += `  ${minutes} ${minutes === 1 ? 'dakika geçti' : 'dakika geçti'}`;
              } else {
                timeAgoMessage += `${minutes} ${minutes === 1 ? 'dakika geçti' : 'dakika geçti'}`;
              }
            }

            activity.timestamps.start = timeAgoMessage || '';
          }
        });

        // Get the status color to apply to the platform svg
        switch (this.lanyardData.d?.discord_status) {
          case 'online':
            this.statusColor = '#43b581';
            break;
          case 'idle':
            this.statusColor = '#faa61a';
            break;
          case 'dnd':
            this.statusColor = '#f04747';
            break;
          case 'offline':
            this.statusColor = '#747f8d';
            break;
          case 'streaming':
            this.statusColor = '#593695';
            break;
          case 'invisible':
            this.statusColor = '#747f8d';
            break;
          case 'unknown':
            this.statusColor = '#747f8d';
            break;
          default:
            this.statusColor = '#747f8d';
            break;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getActivityImageId(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }
    
    if (imageUrl.startsWith('spotify:')) {
      const parts = imageUrl.split(':');
      return parts[1] || '';
    } else {
      return imageUrl;
    }
  }

  public sendMessage(): void {
    window.open(`https://discord.com/users/${this.userId}`, '_blank');

    this.message = '';
  }

  handleImageError(event: any) {
    event.target.src = '../../../assets/images/no-image-found.png';
  }
}
