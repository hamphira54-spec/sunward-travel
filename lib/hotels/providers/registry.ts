import { HotelProvider } from './types';
import { PlaceholderProvider } from './placeholder';
import { LegacyHotellookProvider } from './deep-links';

class ProviderRegistry {
  private providers: Map<string, HotelProvider> = new Map();

  register(provider: HotelProvider) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string): HotelProvider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): HotelProvider[] {
    return Array.from(this.providers.values());
  }

  resolveProvider(destination?: string): HotelProvider | undefined {
    // For M1, just return placeholder or the first available live provider.
    const liveProvider = this.getAllProviders().find(p => p.capabilities.supportsLiveSearch && p.id !== 'placeholder');
    return liveProvider || this.getProvider('placeholder');
  }
}

export const providerRegistry = new ProviderRegistry();

// Auto-register available architecture providers
providerRegistry.register(new PlaceholderProvider());
providerRegistry.register(new LegacyHotellookProvider());
