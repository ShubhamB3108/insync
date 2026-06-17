/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Excalidraw, WelcomeScreen, MainMenu } from "@excalidraw/excalidraw";
import { Sun, Moon, Save, HardDrive, AlertTriangle, X } from "lucide-react";
import "@excalidraw/excalidraw/index.css";
import { useParams } from "react-router-dom";
import { getWhiteboard, updateWhiteboard } from "../../services/whiteboard.service";

export const Whiteboard = () => {
  const [board, setBoard] = useState<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [payloadSize, setPayloadSize] = useState("0.00 KB");
  const [isSaving, setIsSaving] = useState(false);
  
  // Numeric payload tracking state
  const [numericSize, setNumericSize] = useState(0);
  
  // Custom Pop-up Modal visibility state
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const sceneRef = useRef<{
    elements: readonly any[];
    appState: Record<string, any>;
  }>({
    elements: [],
    appState: {},
  });

  const { workspaceId, whiteboardId } = useParams();

  // Helper utility to calculate local data payload parameters
  const calculateSize = (elements: readonly any[], appState: any) => {
    const cleanedScene = {
      elements: elements.filter((el: any) => !el.isDeleted),
      appState: appState,
    };
    const sizeInKB = new Blob([JSON.stringify(cleanedScene)]).size / 1024;
    
    // Always update the true numeric size so deletion unblocks instantly
    setNumericSize(sizeInKB);
    
    // Only update the string footprint reading on screen if it hasn't crossed the limit lock threshold yet
    if (sizeInKB < 500) {
      setPayloadSize(`${sizeInKB.toFixed(2)} KB`);
    }
    
    return sizeInKB;
  };

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await getWhiteboard({
          workspaceId: workspaceId!,
          whiteboardId: whiteboardId!,
        });
        setBoard(res);
        
        if (res?.scene) {
          calculateSize(res.scene.elements ?? [], res.scene.appState ?? {});
        }
      } catch (error) {
        console.error("Failed to fetch whiteboard:", error);
      }
    };
    fetchBoard();
  }, [workspaceId, whiteboardId]);

  // Evaluates if the current state baseline crosses the 500KB cap boundary
  const isOverLimit = numericSize >= 500;

  const handleSave = async () => {
    // INTERCEPT SAVE: If user hits the save action button while over the size cap limit, abort saving and show error popup
    if (isOverLimit) {
      setShowErrorPopup(true);
      return;
    }

    setIsSaving(true);
    try {
      const cleanedScene = {
        elements: sceneRef.current.elements.filter((el: any) => !el.isDeleted),
        appState: sceneRef.current.appState,
      };

      await updateWhiteboard({
        workspaceId: workspaceId!,
        whiteboardId: whiteboardId!,
        scene: cleanedScene,
      });

      const freshBoard = await getWhiteboard({
        workspaceId: workspaceId!,
        whiteboardId: whiteboardId!,
      });
      setBoard(freshBoard);
      
      if (freshBoard?.scene) {
        calculateSize(freshBoard.scene.elements ?? [], freshBoard.scene.appState ?? {});
      }
    } catch (error) {
      console.error("Error updates:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!board) {
    return (
      <div className="h-screen bg-[#121214] flex flex-col items-center justify-center gap-3 text-zinc-400 font-sans">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium tracking-wide">Loading board assets...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full select-none relative overflow-hidden flex flex-col">
      
      {/* Excalidraw UI View Wrapper Block */}
      <div className="flex-1 w-full relative">
        <Excalidraw
          theme={theme}
          initialData={{
            elements: board?.scene?.elements ?? [],
            appState: board?.scene?.appState ?? {},
          }}
          onChange={(elements, appState) => {
            sceneRef.current = { elements, appState };
            
            // Runs continuous tracking loops. If items are deleted, numericSize updates immediately, unlocking the status automatically
            calculateSize(elements, appState);
          }}
          // Configuration options to remove unwanted UI actions and tool buttons
          UIOptions={{
            tools: {
                image:false
              
            },
          }}
          renderTopRightUI={() => {
            return (
              <div className="flex items-center gap-2 mr-2 pointer-events-auto">
                {/* Theme Control */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-100 dark:bg-[#232329] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/50 shadow-sm active:scale-95 transition-all"
                >
                  {theme === "dark" ? (
                    <Moon size={16} className="text-indigo-400 fill-indigo-400/10" />
                  ) : (
                    <Sun size={16} className="text-amber-500 fill-amber-500/10" />
                  )}
                </button>

                {/* Save Workspace Button Trigger */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`h-9 px-3.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 shadow-sm text-white border transition-all active:scale-[0.98] ${
                    isOverLimit
                      ? "bg-amber-600 hover:bg-amber-500 border-amber-700/40 cursor-pointer"
                      : "bg-blue-600 hover:bg-blue-500 border-blue-700/40 cursor-pointer disabled:bg-zinc-700 disabled:text-zinc-400 disabled:border-transparent disabled:cursor-not-allowed"
                  }`}
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={14} strokeWidth={2.5} />
                  )}
                  <span>{isSaving ? "Saving..." : "Save Workspace"}</span>
                </button>
              </div>
            );
          }}
        >
          {/* Custom Menu: Removes all bloated options, keeps only 'Save to...' and 'Export image' */}
          <MainMenu>
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Export />
          </MainMenu>

          <WelcomeScreen>
            <WelcomeScreen.Center>
              <WelcomeScreen.Hints.MenuHint />
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Center.Logo>
                <p className="text-zinc-900 dark:text-white font-bold text-5xl tracking-tight">
                  inSync WhiteBoard
                </p>
              </WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                Brainstorm ideas, design workflows, sketch concepts, and work together
                <br />
                seamlessly on an infinite canvas.
              </WelcomeScreen.Center.Heading>
              <p className="mt-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Powered by Excalidraw Engines
              </p>
              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItemHelp />
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>

      {/* Floating Bottom Status Bar Container with Tooltip Hover Warning */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 group pointer-events-auto">
        
        {/* Tooltip Bubble Warning Elements */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-zinc-950/95 border border-amber-500/30 text-zinc-300 text-[11px] leading-relaxed rounded-xl shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-200 backdrop-blur-md flex gap-2 items-start">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold text-amber-400 block mb-0.5">Payload Constraint Warning</span>
            Don't extend payload to <span className="font-semibold text-zinc-100">500KB</span>. Press <span className="font-semibold text-blue-400">Save Workspace</span> to see changes.
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950/95" />
        </div>

        {/* Dynamic Status Tracking Badge Display Container */}
        <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md cursor-help transition-all duration-200 bg-zinc-900/90 dark:bg-[#1e1e24]/90 text-zinc-400 border ${
          isOverLimit 
            ? "border-red-500/50 text-red-400 dark:text-red-400 animate-pulse" 
            : "border-zinc-800/80 hover:border-amber-500/40"
        }`}>
          <HardDrive size={12} className={isOverLimit ? "text-red-400" : "text-zinc-500 shrink-0"} />
          <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">
            Document Payload: 
            <span className={`font-bold ml-1 ${isOverLimit ? "text-red-200" : "text-zinc-200"}`}>
              {isOverLimit ? "500.00+ KB" : payloadSize}
            </span>
          </span>
          <AlertTriangle size={13} className={isOverLimit ? "text-red-400" : "text-amber-500 shrink-0"} />
        </div>
      </div>

      {/* Custom Payload Exceeded Pop-up Screen Overlay Modal Layout */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-999 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-[#181a23] border border-red-500/30 rounded-xl p-5 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowErrorPopup(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 shadow-inner">
              <AlertTriangle size={22} className="animate-pulse" />
            </div>

            <h3 className="text-zinc-100 font-bold text-base tracking-wide mb-2">
              Payload Exceeded
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-5">
              Your whiteboard cannot be updated because the active scene configuration exceeds the database constraint boundary of <span className="text-red-400 font-semibold">500.00 KB</span>.
              <br />
              <span className="text-zinc-500 block mt-2 text-[11px]">
                Please clear or delete a few local drawing vectors to bring down file parameters.
              </span>
            </p>

            <button
              type="button"
              onClick={() => setShowErrorPopup(false)}
              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Whiteboard;