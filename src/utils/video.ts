/**
 * Helper utilities for video parsing, embedding, and timestamps
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // Patterns for youtube: watch?v=ID, youtu.be/ID, embed/ID, shorts/ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getEmbedUrl(url: string, sourceType: 'youtube' | 'url' | 'upload'): string {
  if (sourceType === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const ytId = extractYouTubeId(url);
    if (ytId) {
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&enablejsapi=1`;
    }
  }
  return url;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${pad(hrs)}:${pad(remMins)}:${pad(secs)}`;
  }
  
  return `${pad(mins)}:${pad(secs)}`;
}

export function parseSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length === 2) {
    return (parts[0] * 60) + parts[1];
  } else if (parts.length === 3) {
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  }
  return 0;
}

export function parseTimestampLines(text: string) {
  // Parses lines like "02:15 - قانون أوم" or "00:00 مقدمة"
  const lines = text.split('\n');
  const chapters = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–:]?\s*(.*)$/);
    if (match) {
      const formattedTime = match[1];
      const title = match[2].trim() || `المقطع ${i + 1}`;
      chapters.push({
        id: `ts-${Date.now()}-${i}`,
        timeSeconds: parseSeconds(formattedTime),
        formattedTime,
        title
      });
    }
  }
  
  return chapters;
}
