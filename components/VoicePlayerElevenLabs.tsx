"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, Volume2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoicePlayerElevenLabsProps {
  workoutText?: string;
  dietText?: string;
  tipsText?: string;
}

// ElevenLabs voice options
const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm, young female' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, young female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, young female' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded, young male' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Emotional, young female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, young male' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp, middle-aged male' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, middle-aged male' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Raspy, young male' },
];

export default function VoicePlayerElevenLabs({ 
  workoutText, 
  dietText, 
  tipsText 
}: VoicePlayerElevenLabsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<"workout" | "diet" | "tips">("workout");
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICES[0].id);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [pauseTime, setPauseTime] = useState(0);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }

    return () => {
      if (currentSource) {
        try {
          currentSource.stop();
        } catch (e) {
        }
      }
    };
  }, []);

  const getCurrentText = () => {
    switch (selectedSection) {
      case "workout":
        return workoutText || "No workout plan available";
      case "diet":
        return dietText || "No diet plan available";
      case "tips":
        return tipsText || "No tips available";
      default:
        return "";
    }
  };

  const handlePlay = async () => {
    if (isPaused && audioBuffer) {
      console.log('Resuming audio');
      playAudioBuffer();
      return;
    }
    const text = getCurrentText();
    if (!text || text.length < 10) {
      alert('No text available to read. Please generate a fitness plan first.');
      return;
    }

    setIsLoading(true);
    console.log('Generating speech with ElevenLabs...');
    console.log('Text length:', text.length);
    console.log('Voice:', VOICES.find(v => v.id === selectedVoiceId)?.name);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate speech');
      }

      console.log('Audio received, decoding...');
      const audioData = await response.arrayBuffer();
      
      if (!audioContext) {
        throw new Error('AudioContext not initialized');
      }
      const buffer = await audioContext.decodeAudioData(audioData);
      setAudioBuffer(buffer);
      setPauseTime(0);
      
      console.log(' Audio decoded, duration:', buffer.duration.toFixed(2), 'seconds');
      playAudioBuffer(buffer);

    } catch (error) {
      console.error('Speech generation error:', error);
      alert(`Failed to generate speech: ${(error as Error).message}`);
      setIsPlaying(false);
      setIsPaused(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudioBuffer = (buffer?: AudioBuffer) => {
    if (!audioContext) return;
    
    const bufferToPlay = buffer || audioBuffer;
    if (!bufferToPlay) return;
    if (currentSource) {
      try {
        currentSource.stop();
      } catch (e) {
      }
    }
    const source = audioContext.createBufferSource();
    source.buffer = bufferToPlay;
    source.connect(audioContext.destination);
    source.onended = () => {
      console.log('🏁 Audio playback finished');
      if (!isPaused) {
        setIsPlaying(false);
        setIsPaused(false);
        setPauseTime(0);
      }
    };
    source.start(0, pauseTime);
    setCurrentSource(source);
    setStartTime(audioContext.currentTime - pauseTime);
    setIsPlaying(true);
    setIsPaused(false);

    console.log('🔊 Playing audio...');
  };

  const handlePause = () => {
    if (currentSource && audioContext && isPlaying) {
      console.log('⏸️ Pausing audio');
      const newPauseTime = audioContext.currentTime - startTime;
      setPauseTime(newPauseTime);
      
      try {
        currentSource.stop();
      } catch (e) {
      }
      
      setCurrentSource(null);
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    console.log('⏹️ Stopping audio');
    
    if (currentSource) {
      try {
        currentSource.stop();
      } catch (e) {
      }
      setCurrentSource(null);
    }
    
    setIsPlaying(false);
    setIsPaused(false);
    setPauseTime(0);
    setAudioBuffer(null);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              🎙️ AI Voice Narrator (ElevenLabs)
            </h3>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            High-quality AI voices powered by ElevenLabs. Select a voice and section to listen.
          </p>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        {/* Section Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedSection === "workout" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("workout");
              if (isPlaying) handleStop();
            }}
            className={selectedSection === "workout" ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
          >
            💪 Workout
          </Button>
          <Button
            variant={selectedSection === "diet" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("diet");
              if (isPlaying) handleStop();
            }}
            className={selectedSection === "diet" ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
          >
            🥗 Diet
          </Button>
          <Button
            variant={selectedSection === "tips" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("tips");
              if (isPlaying) handleStop();
            }}
            className={selectedSection === "tips" ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}
          >
            💡 Tips
          </Button>
        </div>

        {/* Voice Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Voice</label>
          <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          {!isPlaying && !isPaused && (
            <Button
              onClick={handlePlay}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play {selectedSection}
                </>
              )}
            </Button>
          )}
          
          {isPlaying && (
            <Button onClick={handlePause} variant="outline" className="flex-1">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {isPaused && (
            <Button
              onClick={handlePlay}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          {(isPlaying || isPaused) && (
            <Button onClick={handleStop} variant="outline">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        {/* Status indicator */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-purple-600 dark:text-purple-400"
          >
            🔊 Playing {selectedSection} with {VOICES.find(v => v.id === selectedVoiceId)?.name}...
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-gray-500"
          >
            ⏳ Generating audio with ElevenLabs AI... This may take a few seconds.
          </motion.div>
        )}
      </Card>
    </div>
  );
}
