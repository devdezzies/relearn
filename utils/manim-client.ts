import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize the OpenAI client with Groq API configuration
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

// System prompt for video script generation
const VIDEO_SCRIPT_SYSTEM_PROMPT = `You are an AI assistant specialized in breaking down STEM concepts into clear, visually engaging video scripts.
Your task is to convert complex topics into a well-structured video script with clear time segments and visual descriptions.

Guidelines for Script Generation:
1. Break the content into clear time segments (10-15 seconds each)
2. Focus on visual transitions and flow between concepts
3. Use clear language that matches the visual elements
4. Include specific visual descriptions for each segment
5. Maintain educational accuracy while being visually engaging
6. The information should be incredibly detailed and comprehensive.

Output Format:
For each segment, provide:
1. Timestamp (e.g., "0:00-0:10")
2. Narration text
3. Visual description
4. Key concepts to highlight
5. Transitions between segments

Example Output Structure:
{
  "segments": [
    {
      "timeframe": "0:00-0:10",
      "narration": "Welcome to our exploration of Newton's Laws of Motion...",
      "visuals": "Start with a simple pendulum swinging...",
      "key_concepts": ["Force", "Motion", "Inertia"],
      "transitions": "Fade to next scene showing..."
    }
  ]
}`;

// System prompt for Manim code generation
const MANIM_CODE_SYSTEM_PROMPT = `You are an AI assistant specialized in generating Manim animation code for educational STEM videos.
Your task is to convert video scripts into precise, executable Manim Python code that creates engaging 2-3 minute educational animations.

CORE PRINCIPLES:
1. Use latest Manim Community Edition syntax with proper imports
2. Create smooth, well-timed transitions between concepts
3. Implement non-overlapping visual components with strategic positioning
4. Use appropriate colors, fonts, and styling for clarity
5. Generate complete, executable code with proper scene flow
6. Include voiceover integration for synchronized narration
7. Balance visual complexity with educational clarity
8. Don't add any images or external files to the code (png, jpg, jpeg, mp4, wav, etc).

ANIMATION BEST PRACTICES:
- Use strategic wait times and run_time parameters
- Implement proper fade in/out sequences
- Position elements to avoid visual overlap
- Use consistent color schemes and styling
- Create logical progression from simple to complex
- Include mathematical accuracy in formulas and diagrams

Here are three exemplary STEM animations that demonstrate best practices:

EXAMPLE 1: PHYSICS - Wave Interference
Input: "Explain how two waves interfere with each other, showing constructive and destructive interference patterns."

Output:
\`\`\`python
from manim import *
from manim_voiceover import VoiceoverScene
from kokoro_mv.koko import KokoroService

class WaveInterference(VoiceoverScene):
    def construct(self):
        self.set_speech_service(KokoroService(
            model_path="kokoro-v0_19.onnx",
            voices_path="voices.bin",
            voice="af"
        ))
        
        # Title and setup
        title = Text("Wave Interference", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        with self.voiceover(text="Today we'll explore how waves interact through interference.") as tracker:
            self.play(Write(title), run_time=tracker.duration)
        
        self.wait(0.5)
        
        # Create axes for wave visualization
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-3, 3, 1],
            x_length=10,
            y_length=6,
            axis_config={"color": GRAY}
        ).shift(DOWN * 0.5)
        
        # Wave equations and parameters
        wave1_eq = MathTex(r"y_1 = A\sin(kx - \omega t)", color=RED).scale(0.8)
        wave2_eq = MathTex(r"y_2 = A\sin(kx - \omega t + \phi)", color=BLUE).scale(0.8)
        wave1_eq.to_corner(UL).shift(DOWN * 1.5)
        wave2_eq.next_to(wave1_eq, DOWN, buff=0.3)
        
        with self.voiceover(text="Let's start with two sinusoidal waves with the same amplitude and frequency.") as tracker:
            self.play(
                Create(axes),
                Write(wave1_eq),
                Write(wave2_eq),
                run_time=tracker.duration
            )
        
        # Define wave functions
        def wave1_func(x, t=0):
            return np.sin(x - 2*t)
        
        def wave2_func(x, t=0, phase=0):
            return np.sin(x - 2*t + phase)
        
        def combined_wave_func(x, t=0, phase=0):
            return wave1_func(x, t) + wave2_func(x, t, phase)
        
        # Create initial waves
        wave1 = axes.plot(lambda x: wave1_func(x), color=RED, stroke_width=3)
        wave2 = axes.plot(lambda x: wave2_func(x), color=BLUE, stroke_width=3)
        
        wave1_label = Text("Wave 1", color=RED, font_size=24).next_to(wave1, UR, buff=0.3)
        wave2_label = Text("Wave 2", color=BLUE, font_size=24).next_to(wave2, DR, buff=0.3)
        
        with self.voiceover(text="Here's our first wave in red, and our second wave in blue.") as tracker:
            self.play(
                Create(wave1),
                Create(wave2),
                Write(wave1_label),
                Write(wave2_label),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Show constructive interference
        constructive_title = Text("Constructive Interference", color=GREEN, font_size=36)
        constructive_title.to_edge(UP).shift(DOWN * 0.5)
        
        with self.voiceover(text="When waves are in phase, they add constructively, creating larger amplitudes.") as tracker:
            self.play(
                Transform(title, constructive_title),
                run_time=tracker.duration
            )
        
        # Create combined wave (in phase)
        combined_wave = axes.plot(lambda x: combined_wave_func(x, phase=0), color=GREEN, stroke_width=4)
        combined_label = Text("Combined Wave", color=GREEN, font_size=24)
        combined_label.next_to(axes, RIGHT).shift(UP * 2)
        
        with self.voiceover(text="The resulting wave has twice the amplitude of the individual waves.") as tracker:
            self.play(
                Create(combined_wave),
                Write(combined_label),
                wave1.animate.set_stroke(opacity=0.5),
                wave2.animate.set_stroke(opacity=0.5),
                run_time=tracker.duration
            )
        
        self.wait(1.5)
        
        # Transition to destructive interference
        destructive_title = Text("Destructive Interference", color=ORANGE, font_size=36)
        destructive_title.to_edge(UP).shift(DOWN * 0.5)
        
        with self.voiceover(text="Now let's see what happens when waves are out of phase.") as tracker:
            self.play(
                Transform(title, destructive_title),
                FadeOut(combined_wave),
                FadeOut(combined_label),
                run_time=tracker.duration
            )
        
        # Update wave2 to be out of phase
        wave2_new = axes.plot(lambda x: wave2_func(x, phase=PI), color=BLUE, stroke_width=3)
        phase_eq = MathTex(r"\phi = \pi", color=YELLOW).scale(0.8)
        phase_eq.next_to(wave2_eq, RIGHT, buff=0.5)
        
        with self.voiceover(text="When the phase difference is pi radians, the waves cancel each other out.") as tracker:
            self.play(
                Transform(wave2, wave2_new),
                Write(phase_eq),
                wave1.animate.set_stroke(opacity=1),
                wave2.animate.set_stroke(opacity=1),
                run_time=tracker.duration
            )
        
        # Show destructive interference result
        destructive_wave = axes.plot(lambda x: combined_wave_func(x, phase=PI), color=ORANGE, stroke_width=4)
        destructive_label = Text("Cancelled Wave", color=ORANGE, font_size=24)
        destructive_label.next_to(axes, RIGHT).shift(UP * 2)
        
        with self.voiceover(text="The result is complete cancellation - no wave at all!") as tracker:
            self.play(
                Create(destructive_wave),
                Write(destructive_label),
                wave1.animate.set_stroke(opacity=0.5),
                wave2.animate.set_stroke(opacity=0.5),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Animated interference demonstration
        animation_title = Text("Dynamic Interference", color=PURPLE, font_size=36)
        animation_title.to_edge(UP).shift(DOWN * 0.5)
        
        with self.voiceover(text="Let's watch how interference changes as we vary the phase difference.") as tracker:
            self.play(
                Transform(title, animation_title),
                FadeOut(destructive_wave),
                FadeOut(destructive_label),
                FadeOut(wave1_label),
                FadeOut(wave2_label),
                run_time=tracker.duration
            )
        
        # Phase slider visualization
        phase_tracker = ValueTracker(0)
        phase_display = DecimalNumber(0, num_decimal_places=2, color=YELLOW)
        phase_display.add_updater(lambda m: m.set_value(phase_tracker.get_value()))
        phase_text = Text("Phase: ", color=WHITE, font_size=24)
        phase_group = VGroup(phase_text, phase_display).arrange(RIGHT)
        phase_group.to_corner(UR).shift(LEFT * 0.5 + DOWN * 1)
        
        # Dynamic waves
        wave1_dynamic = always_redraw(lambda: axes.plot(
            lambda x: wave1_func(x), color=RED, stroke_width=3
        ))
        wave2_dynamic = always_redraw(lambda: axes.plot(
            lambda x: wave2_func(x, phase=phase_tracker.get_value()), color=BLUE, stroke_width=3
        ))
        combined_dynamic = always_redraw(lambda: axes.plot(
            lambda x: combined_wave_func(x, phase=phase_tracker.get_value()), 
            color=PURPLE, stroke_width=4
        ))
        
        self.add(wave1_dynamic, wave2_dynamic, combined_dynamic, phase_group)
        
        with self.voiceover(text="Watch how the combined wave changes as we sweep through different phase relationships.") as tracker:
            self.play(
                phase_tracker.animate.set_value(2*PI),
                run_time=tracker.duration,
                rate_func=linear
            )
        
        self.wait(1)
        
        # Conclusion
        conclusion = Text("Wave interference creates complex patterns\nin nature and technology!", 
                         color=WHITE, font_size=32)
        conclusion.center()
        
        with self.voiceover(text="Wave interference is fundamental to understanding many phenomena in physics and engineering.") as tracker:
            self.play(
                FadeOut(axes),
                FadeOut(wave1_dynamic),
                FadeOut(wave2_dynamic),
                FadeOut(combined_dynamic),
                FadeOut(wave1_eq),
                FadeOut(wave2_eq),
                FadeOut(phase_eq),
                FadeOut(phase_group),
                Transform(title, conclusion),
                run_time=tracker.duration
            )
        
        self.wait(2)
\`\`\`

EXAMPLE 2: MATHEMATICS - Calculus Derivatives
Input: "Visualize how derivatives represent the slope of tangent lines and rates of change."

Output:
\`\`\`python
from manim import *
from manim_voiceover import VoiceoverScene
from kokoro_mv.koko import KokoroService

class DerivativeVisualization(VoiceoverScene):
    def construct(self):
        self.set_speech_service(KokoroService(
            model_path="kokoro-v0_19.onnx",
            voices_path="voices.bin",
            voice="af"
        ))
        
        # Title
        title = Text("Understanding Derivatives", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        with self.voiceover(text="Let's explore what derivatives really mean geometrically.") as tracker:
            self.play(Write(title), run_time=tracker.duration)
        
        # Set up coordinate system
        axes = Axes(
            x_range=[-1, 4, 1],
            y_range=[-1, 10, 2],
            x_length=8,
            y_length=6,
            axis_config={"color": GRAY, "include_numbers": True}
        ).shift(DOWN * 0.5)
        
        # Define function f(x) = x^2
        def func(x):
            return x**2
        
        def derivative_func(x):
            return 2*x
        
        # Create the curve
        curve = axes.plot(func, x_range=[0, 3], color=RED, stroke_width=4)
        func_label = MathTex(r"f(x) = x^2", color=RED, font_size=36)
        func_label.next_to(axes, UR).shift(LEFT * 2 + DOWN * 0.5)
        
        with self.voiceover(text="Here's our function f of x equals x squared.") as tracker:
            self.play(
                Create(axes),
                Create(curve),
                Write(func_label),
                run_time=tracker.duration
            )
        
        # Secant line demonstration
        secant_title = Text("Secant Lines", color=YELLOW, font_size=32)
        secant_title.to_edge(UP).shift(DOWN * 0.8)
        
        with self.voiceover(text="Let's start by looking at secant lines between two points.") as tracker:
            self.play(Transform(title, secant_title), run_time=tracker.duration)
        
        # Points for secant line
        x1 = 1
        x2_tracker = ValueTracker(2.5)
        
        point1 = Dot(axes.c2p(x1, func(x1)), color=GREEN, radius=0.08)
        point1_label = MathTex(f"({x1}, {func(x1)})", color=GREEN, font_size=24)
        point1_label.next_to(point1, DL, buff=0.2)
        
        point2 = always_redraw(lambda: Dot(
            axes.c2p(x2_tracker.get_value(), func(x2_tracker.get_value())), 
            color=BLUE, radius=0.08
        ))
        
        point2_label = always_redraw(lambda: MathTex(
            f"({x2_tracker.get_value():.1f}, {func(x2_tracker.get_value()):.1f})", 
            color=BLUE, font_size=24
        ).next_to(point2, UR, buff=0.2))
        
        # Secant line
        secant_line = always_redraw(lambda: axes.plot_line_graph(
            [x1, x2_tracker.get_value()],
            [func(x1), func(x2_tracker.get_value())],
            line_color=YELLOW,
            stroke_width=3
        ))
        
        # Slope calculation
        slope_calc = always_redraw(lambda: MathTex(
            rf"m = \frac{{{func(x2_tracker.get_value()):.1f} - {func(x1)}}}{{{{x2_tracker.get_value():.1f} - {x1}}} = {(func(x2_tracker.get_value()) - func(x1))/(x2_tracker.get_value() - x1):.2f}",
            color=YELLOW,
            font_size=28
        ).to_corner(UL).shift(DOWN * 2))
        
        with self.voiceover(text="The secant line connects two points and has a slope equal to the change in y over change in x.") as tracker:
            self.play(
                Create(point1),
                Create(point2),
                Write(point1_label),
                Write(point2_label),
                Create(secant_line),
                Write(slope_calc),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Animate secant approaching tangent
        with self.voiceover(text="Now watch what happens as we move the second point closer to the first.") as tracker:
            self.play(
                x2_tracker.animate.set_value(1.5),
                run_time=tracker.duration
            )
        
        with self.voiceover(text="As the points get closer, the secant line approaches the tangent line.") as tracker:
            self.play(
                x2_tracker.animate.set_value(1.1),
                run_time=tracker.duration
            )
        
        # Transition to tangent line
        tangent_title = Text("Tangent Line & Derivative", color=ORANGE, font_size=32)
        tangent_title.to_edge(UP).shift(DOWN * 0.8)
        
        with self.voiceover(text="The derivative is the slope of this tangent line at any point.") as tracker:
            self.play(
                Transform(title, tangent_title),
                x2_tracker.animate.set_value(x1 + 0.001),
                run_time=tracker.duration
            )
        
        # Replace with actual tangent line
        tangent_slope = derivative_func(x1)
        tangent_line = axes.plot_line_graph(
            [x1 - 0.5, x1 + 0.5],
            [func(x1) - 0.5*tangent_slope, func(x1) + 0.5*tangent_slope],
            line_color=ORANGE,
            stroke_width=4
        )
        
        derivative_formula = MathTex(
            rf"f'({x1}) = \lim_{{\Delta x \to 0}} \frac{{f({x1} + \Delta x) - f({x1})}}{{\Delta x}} = {tangent_slope}",
            color=ORANGE,
            font_size=28
        ).to_corner(UL).shift(DOWN * 2)
        
        with self.voiceover(text="At x equals 1, the derivative equals 2, which is the slope of our tangent line.") as tracker:
            self.play(
                FadeOut(secant_line),
                FadeOut(point2),
                FadeOut(point2_label),
                FadeOut(slope_calc),
                Create(tangent_line),
                Write(derivative_formula),
                run_time=tracker.duration
            )
        
        self.wait(1.5)
        
        # Multiple tangent lines
        multiple_title = Text("Derivative Function", color=PURPLE, font_size=32)
        multiple_title.to_edge(UP).shift(DOWN * 0.8)
        
        with self.voiceover(text="The derivative varies at different points along the curve.") as tracker:
            self.play(Transform(title, multiple_title), run_time=tracker.duration)
        
        # Create multiple tangent lines
        x_values = [0.5, 1.5, 2, 2.5]
        tangent_lines = VGroup()
        points = VGroup()
        slopes = VGroup()
        
        for i, x_val in enumerate(x_values):
            # Point
            point = Dot(axes.c2p(x_val, func(x_val)), color=GREEN, radius=0.06)
            points.add(point)
            
            # Tangent line
            slope_val = derivative_func(x_val)
            tangent = axes.plot_line_graph(
                [x_val - 0.3, x_val + 0.3],
                [func(x_val) - 0.3*slope_val, func(x_val) + 0.3*slope_val],
                line_color=PURPLE,
                stroke_width=3
            )
            tangent_lines.add(tangent)
            
            # Slope label
            slope_label = MathTex(f"f'({x_val}) = {slope_val}", color=PURPLE, font_size=20)
            slope_label.next_to(axes.c2p(x_val, func(x_val)), UP + RIGHT, buff=0.1)
            slopes.add(slope_label)
        
        with self.voiceover(text="Let's see the derivative at several different points.") as tracker:
            self.play(
                FadeOut(point1),
                FadeOut(point1_label),
                FadeOut(tangent_line),
                AnimationGroup(
                    Create(points),
                    Create(tangent_lines),
                    Write(slopes),
                    lag_ratio=0.3
                ),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Show derivative curve
        with self.voiceover(text="If we plot all these slope values, we get the derivative function.") as tracker:
            derivative_curve = axes.plot(
                derivative_func, 
                x_range=[0, 3], 
                color=GREEN, 
                stroke_width=4
            )
            derivative_label = MathTex(r"f'(x) = 2x", color=GREEN, font_size=36)
            derivative_label.next_to(func_label, DOWN, buff=0.5)
            
            self.play(
                Create(derivative_curve),
                Write(derivative_label),
                run_time=tracker.duration
            )
        
        # Highlight relationship
        with self.voiceover(text="Notice how the derivative is steeper where the original function is steeper.") as tracker:
            highlight_point = ValueTracker(0.5)
            
            highlight_dot_original = always_redraw(lambda: Dot(
                axes.c2p(highlight_point.get_value(), func(highlight_point.get_value())),
                color=YELLOW, radius=0.1
            ))
            
            highlight_dot_derivative = always_redraw(lambda: Dot(
                axes.c2p(highlight_point.get_value(), derivative_func(highlight_point.get_value())),
                color=YELLOW, radius=0.1
            ))
            
            self.add(highlight_dot_original, highlight_dot_derivative)
            
            self.play(
                highlight_point.animate.set_value(2.5),
                run_time=tracker.duration,
                rate_func=there_and_back
            )
        
        self.wait(1)
        
        # Conclusion
        conclusion = Text("Derivatives measure instantaneous\nrates of change!", 
                         color=WHITE, font_size=36)
        conclusion.center()
        
        with self.voiceover(text="Derivatives are fundamental tools for understanding how quantities change in calculus and beyond.") as tracker:
            self.play(
                *[FadeOut(mob) for mob in self.mobjects if mob != conclusion],
                FadeIn(conclusion),
                run_time=tracker.duration
            )
        
        self.wait(2)
\`\`\`

EXAMPLE 3: CHEMISTRY - Molecular Orbital Theory
Input: "Show how atomic orbitals combine to form molecular orbitals in hydrogen molecule."

Output:
\`\`\`python
from manim import *
from manim_voiceover import VoiceoverScene
from kokoro_mv.koko import KokoroService

class MolecularOrbital(VoiceoverScene):
    def construct(self):
        self.set_speech_service(KokoroService(
            model_path="kokoro-v0_19.onnx",
            voices_path="voices.bin",
            voice="af"
        ))
        
        # Title
        title = Text("Molecular Orbital Theory", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        with self.voiceover(text="Let's explore how atoms bond by forming molecular orbitals.") as tracker:
            self.play(Write(title), run_time=tracker.duration)
        
        # Subtitle for H2 molecule
        subtitle = Text("Formation of H₂ Molecule", font_size=32, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        with self.voiceover(text="We'll use the hydrogen molecule as our example.") as tracker:
            self.play(Write(subtitle), run_time=tracker.duration)
        
        self.wait(0.5)
        
        # Create atomic orbitals
        orbital_title = Text("Atomic Orbitals", color=YELLOW, font_size=28)
        orbital_title.to_corner(UL).shift(DOWN * 2)
        
        with self.voiceover(text="Let's start with two separate hydrogen atoms, each with one electron in a 1s orbital.") as tracker:
            self.play(Write(orbital_title), run_time=tracker.duration)
        
        # Hydrogen atom 1
        nucleus1 = Dot(LEFT * 3, color=RED, radius=0.1)
        nucleus1_label = Text("H", color=RED, font_size=24).next_to(nucleus1, DOWN, buff=0.2)
        
        # 1s orbital representation (simplified as circle)
        orbital1 = Circle(radius=1, color=BLUE, fill_opacity=0.3).move_to(nucleus1)
        electron1 = Dot(nucleus1.get_center() + UP * 0.7, color=WHITE, radius=0.05)
        
        # Hydrogen atom 2
        nucleus2 = Dot(RIGHT * 3, color=RED, radius=0.1)
        nucleus2_label = Text("H", color=RED, font_size=24).next_to(nucleus2, DOWN, buff=0.2)
        
        orbital2 = Circle(radius=1, color=BLUE, fill_opacity=0.3).move_to(nucleus2)
        electron2 = Dot(nucleus2.get_center() + DOWN * 0.7, color=WHITE, radius=0.05)
        
        # Orbital labels
        orbital1_label = MathTex("1s", color=BLUE, font_size=20).next_to(orbital1, UL)
        orbital2_label = MathTex("1s", color=BLUE, font_size=20).next_to(orbital2, UR)
        
        atoms_group = VGroup(
            nucleus1, nucleus1_label, orbital1, electron1, orbital1_label,
            nucleus2, nucleus2_label, orbital2, electron2, orbital2_label
        )
        
        with self.voiceover(text="Here are our two hydrogen atoms, far apart from each other.") as tracker:
            self.play(Create(atoms_group), run_time=tracker.duration)
        
        self.wait(1)
        
        # Bring atoms closer
        approach_title = Text("Orbital Overlap", color=GREEN, font_size=28)
        approach_title.to_corner(UL).shift(DOWN * 2)
        
        with self.voiceover(text="As the atoms approach each other, their orbitals begin to overlap.") as tracker:
            self.play(
                Transform(orbital_title, approach_title),
                nucleus1.animate.shift(RIGHT * 1.5),
                orbital1.animate.shift(RIGHT * 1.5),
                electron1.animate.shift(RIGHT * 1.5),
                orbital1_label.animate.shift(RIGHT * 1.5),
                nucleus1_label.animate.shift(RIGHT * 1.5),
                nucleus2.animate.shift(LEFT * 1.5),
                orbital2.animate.shift(LEFT * 1.5),
                electron2.animate.shift(LEFT * 1.5),
                orbital2_label.animate.shift(LEFT * 1.5),
                nucleus2_label.animate.shift(LEFT * 1.5),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Show molecular orbital formation
        mo_title = Text("Molecular Orbital Formation", color=PURPLE, font_size=28)
        mo_title.to_corner(UL).shift(DOWN * 2)
        
        with self.voiceover(text="When orbitals overlap, they combine to form molecular orbitals.") as tracker:
            self.play(Transform(orbital_title, mo_title), run_time=tracker.duration)
        
        # Energy diagram setup
        energy_diagram = Axes(
            x_range=[-2, 2, 1],
            y_range=[0, 4, 1],
            x_length=6,
            y_length=4,
            axis_config={"include_numbers": False, "color": GRAY}
        ).to_edge(DOWN).shift(UP * 0.5)
        
        # Energy levels
        atomic_energy = 2
        bonding_energy = 1.2
        antibonding_energy = 2.8
        
        # Atomic orbital energy levels
        ao1_line = Line(
            energy_diagram.c2p(-1.5, atomic_energy),
            energy_diagram.c2p(-1, atomic_energy),
            color=BLUE, stroke_width=4
        )
        ao2_line = Line(
            energy_diagram.c2p(1, atomic_energy),
            energy_diagram.c2p(1.5, atomic_energy),
            color=BLUE, stroke_width=4
        )
        
        # Molecular orbital energy levels
        bonding_line = Line(
            energy_diagram.c2p(-0.3, bonding_energy),
            energy_diagram.c2p(0.3, bonding_energy),
            color=GREEN, stroke_width=4
        )
        antibonding_line = Line(
            energy_diagram.c2p(-0.3, antibonding_energy),
            energy_diagram.c2p(0.3, antibonding_energy),
            color=RED, stroke_width=4
        )
        
        # Labels
        ao_label = Text("Atomic Orbitals", color=BLUE, font_size=20)
        ao_label.next_to(energy_diagram, LEFT).shift(UP * 0.5)
        
        mo_label = Text("Molecular Orbitals", color=WHITE, font_size=20)
        mo_label.next_to(energy_diagram, RIGHT).shift(UP * 0.5)
        
        bonding_label = MathTex(r"\sigma_{1s}", color=GREEN, font_size=24)
        bonding_label.next_to(bonding_line, RIGHT, buff=0.3)
        
        antibonding_label = MathTex(r"\sigma^*_{1s}", color=RED, font_size=24)
        antibonding_label.next_to(antibonding_line, RIGHT, buff=0.3)
        
        with self.voiceover(text="Let's look at the energy diagram to understand this better.") as tracker:
            self.play(
                Create(energy_diagram),
                Create(ao1_line),
                Create(ao2_line),
                Write(ao_label),
                Write(mo_label),
                run_time=tracker.duration
            )
        
        # Show molecular orbitals formation
        with self.voiceover(text="Two molecular orbitals form: a lower energy bonding orbital and a higher energy antibonding orbital.") as tracker:
            self.play(
                Create(bonding_line),
                Create(antibonding_line),
                Write(bonding_label),
                Write(antibonding_label),
                run_time=tracker.duration
            )
        
        # Add connecting lines
        connect1 = DashedLine(ao1_line.get_right(), bonding_line.get_left(), color=GRAY, stroke_width=2)
        connect2 = DashedLine(ao2_line.get_left(), bonding_line.get_right(), color=GRAY, stroke_width=2)
        connect3 = DashedLine(ao1_line.get_right(), antibonding_line.get_left(), color=GRAY, stroke_width=2)
        connect4 = DashedLine(ao2_line.get_left(), antibonding_line.get_right(), color=GRAY, stroke_width=2)
        
        with self.voiceover(text="The atomic orbitals combine through constructive and destructive interference.") as tracker:
            self.play(
                Create(connect1),
                Create(connect2),
                Create(connect3),
                Create(connect4),
                run_time=tracker.duration
            )
        
        # Electron configuration
        with self.voiceover(text="The two electrons occupy the lower energy bonding orbital.") as tracker:
            # Electrons in bonding orbital
            electron_up = Text("↑", color=WHITE, font_size=20).next_to(bonding_line, UP, buff=0.1).shift(LEFT * 0.1)
            electron_down = Text("↓", color=WHITE, font_size=20).next_to(bonding_line, UP, buff=0.1).shift(RIGHT * 0.1)
            
            self.play(
                Write(electron_up),
                Write(electron_down),
                run_time=tracker.duration
            )
        
        self.wait(1)
        
        # Show 3D molecular orbital shapes
        orbital_shapes_title = Text("Molecular Orbital Shapes", color=ORANGE, font_size=28)
        orbital_shapes_title.to_corner(UL).shift(DOWN * 2)
        
        with self.voiceover(text="Let's visualize the actual shapes of these molecular orbitals.") as tracker:
            self.play(
                Transform(orbital_title, orbital_shapes_title),
                FadeOut(atoms_group),
                FadeOut(energy_diagram),
                FadeOut(ao1_line),
                FadeOut(ao2_line),
                FadeOut(bonding_line),
                FadeOut(antibonding_line),
                FadeOut(ao_label),
                FadeOut(mo_label),
                FadeOut(bonding_label),
                FadeOut(antibonding_label),
                FadeOut(connect1),
                FadeOut(connect2),
                FadeOut(connect3),
                FadeOut(connect4),
                FadeOut(electron_up),
                FadeOut(electron_down),
                run_time=tracker.duration
            )
        
        # Bonding orbital visualization
        bonding_title = Text("σ₁ₛ Bonding Orbital", color=GREEN, font_size=32)
        bonding_title.center().shift(UP * 2.5)
        
        # Nuclei positions
        nucleus_left = Dot(LEFT * 1.5, color=RED, radius=0.08)
        nucleus_right = Dot(RIGHT * 1.5, color=RED, radius=0.08)
        nucleus_left_label = Text("H⁺", color=RED, font_size=20).next_to(nucleus_left, DOWN)
        nucleus_right_label = Text("H⁺", color=RED, font_size=20).next_to(nucleus_right, DOWN)
        
        # Bonding orbital shape (elongated ellipse)
        bonding_orbital = Ellipse(
            width=5, height=2, 
            color=GREEN, fill_opacity=0.4, stroke_width=3
        ).stretch(1.2, 0)
        
        with self.voiceover(text="The bonding orbital has high electron density between the nuclei, creating a strong bond.") as tracker:
            self.play(
                Write(bonding_title),
                Create(nucleus_left),
                Create(nucleus_right),
                Write(nucleus_left_label),
                Write(nucleus_right_label),
                Create(bonding_orbital),
                run_time=tracker.duration
            )
        
        # Add electron density indication
        density_points = VGroup()
        for i in range(15):
            x_pos = -2 + 4*i/14
            # Higher density near center
            alpha = 0.8 * np.exp(-2*abs(x_pos)**2)
            point = Dot(
                [x_pos, 0, 0], 
                color=WHITE, 
                radius=0.02,
                fill_opacity=alpha
            )
            density_points.add(point)
        
        with self.voiceover(text="The electron density is highest between the two nuclei.") as tracker:
            self.play(Create(density_points), run_time=tracker.duration)
        
        self.wait(1.5)
        
        # Transition to antibonding orbital
        antibonding_title = Text("σ*₁ₛ Antibonding Orbital", color=RED, font_size=32)
        antibonding_title.center().shift(UP * 2.5)
        
        # Antibonding orbital shape (two separate lobes)
        left_lobe = Circle(radius=0.8, color=RED, fill_opacity=0.4).shift(LEFT * 1.5)
        right_lobe = Circle(radius=0.8, color=RED, fill_opacity=0.4).shift(RIGHT * 1.5)
        
        # Node indication
        node_line = DashedLine(UP * 1.5, DOWN * 1.5, color=YELLOW, stroke_width=3)
        node_label = Text("Node", color=YELLOW, font_size=20).next_to(node_line, UP)
        
        with self.voiceover(text="The antibonding orbital has a node between the nuclei, with zero electron density there.") as tracker:
            self.play(
                Transform(bonding_title, antibonding_title),
                Transform(bonding_orbital, VGroup(left_lobe, right_lobe)),
                FadeOut(density_points),
                Create(node_line),
                Write(node_label),
                run_time=tracker.duration
            )
        
        # Antibonding density points
        antibonding_density = VGroup()
        for i in range(10):
            # Left lobe
            angle = 2*PI*i/10
            point_left = Dot(
                LEFT * 1.5 + 0.5 * np.array([np.cos(angle), np.sin(angle), 0]),
                color=WHITE, radius=0.02, fill_opacity=0.6
            )
            antibonding_density.add(point_left)
            
            # Right lobe
            point_right = Dot(
                RIGHT * 1.5 + 0.5 * np.array([np.cos(angle), np.sin(angle), 0]),
                color=WHITE, radius=0.02, fill_opacity=0.6
            )
            antibonding_density.add(point_right)
        
        with self.voiceover(text="Electron density is concentrated away from the bonding region, weakening the bond.") as tracker:
            self.play(Create(antibonding_density), run_time=tracker.duration)
        
        self.wait(1)
        
        # Bond formation conclusion
        conclusion_title = Text("H₂ Molecule Formation", color=BLUE, font_size=32)
        conclusion_title.center().shift(UP * 2.5)
        
        # Final molecule representation
        h2_bond = Line(LEFT * 1.5, RIGHT * 1.5, color=WHITE, stroke_width=6)
        h2_nuclei_left = Dot(LEFT * 1.5, color=RED, radius=0.1)
        h2_nuclei_right = Dot(RIGHT * 1.5, color=RED, radius=0.1)
        h2_label_left = Text("H", color=WHITE, font_size=24).next_to(h2_nuclei_left, LEFT)
        h2_label_right = Text("H", color=WHITE, font_size=24).next_to(h2_nuclei_right, RIGHT)
        
        bond_strength = Text("Bond Energy: 436 kJ/mol", color=GREEN, font_size=24)
        bond_length = Text("Bond Length: 74 pm", color=GREEN, font_size=24)
        
        bond_info = VGroup(bond_strength, bond_length).arrange(DOWN, buff=0.3)
        bond_info.next_to(h2_bond, DOWN, buff=1)
        
        with self.voiceover(text="The result is a stable hydrogen molecule with a strong covalent bond.") as tracker:
            self.play(
                Transform(bonding_title, conclusion_title),
                FadeOut(bonding_orbital),
                FadeOut(antibonding_density),
                FadeOut(node_line),
                FadeOut(node_label),
                Transform(nucleus_left, h2_nuclei_left),
                Transform(nucleus_right, h2_nuclei_right),
                Transform(nucleus_left_label, h2_label_left),
                Transform(nucleus_right_label, h2_label_right),
                Create(h2_bond),
                Write(bond_info),
                run_time=tracker.duration
            )
        
        self.wait(1.5)
        
        # Final summary
        summary = Text("Molecular orbitals explain chemical bonding\nthrough quantum mechanical principles!", 
                      color=WHITE, font_size=32)
        summary.center()
        
        with self.voiceover(text="Molecular orbital theory provides a quantum mechanical foundation for understanding chemical bonds.") as tracker:
            self.play(
                *[FadeOut(mob) for mob in self.mobjects if mob != summary],
                FadeIn(summary),
                run_time=tracker.duration
            )
        
        self.wait(2)
\`\`\`

RESPONSE GUIDELINES:
When generating Manim code, ensure:

1. **Complete Functionality**: Every script should be fully executable without errors
2. **Educational Flow**: Start simple, build complexity gradually, end with synthesis
3. **Visual Clarity**: Use strategic positioning, appropriate colors, and clear labels
4. **Timing Precision**: Synchronize animations with voiceover using tracker.duration
5. **Mathematical Accuracy**: Ensure all formulas, calculations, and representations are correct
6. **Engagement**: Include interactive elements, dynamic visualizations, and smooth transitions
7. **Professional Quality**: Use consistent styling, proper scene management, and clean code structure

Generate 2-3 minute educational animations that demonstrate mastery of both Manim techniques and subject matter expertise.`;

// Function to generate video script with time segments
export async function generateVideoScript(topic: string, complexity: "beginner" | "intermediate" | "advanced") {
  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: VIDEO_SCRIPT_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Create a video script for explaining ${topic}. Target level: ${complexity}. 
                 Include clear time segments, visual descriptions, and transitions.`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: messages,
      temperature: 0.7,
      top_p: 0.8
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating video script:", error);
    throw error;
  }
}

// Function to generate Manim code from video script
export async function generateManimCode(videoScript: string) {
  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: MANIM_CODE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Convert the following video script into Manim code. Ensure smooth transitions and proper timing:
                 ${videoScript}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: messages,
      temperature: 0.7,
      top_p: 0.8
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating Manim code:", error);
    throw error;
  }
}

// Function to handle the complete video generation pipeline
export async function generateEducationalVideo(topic: string, complexity: "beginner" | "intermediate" | "advanced") {
  try {
    console.log(`[Video Generation] Starting video generation for topic: ${topic} (${complexity} level)`);

    // Step 1: Generate the video script with time segments
    console.log('[Video Generation] Step 1: Generating video script...');
    const videoScript = await generateVideoScript(topic, complexity);
    console.log('\n[Video Generation] Generated Video Script:');
    console.log('----------------------------------------');
    console.log(videoScript);
    console.log('----------------------------------------\n');

    // Step 2: Generate Manim code from the video script
    console.log('[Video Generation] Step 2: Generating Manim code...');
    const manimCode = await generateManimCode(videoScript);
    console.log('\n[Video Generation] Generated Manim Code:');
    console.log('----------------------------------------');
    console.log(manimCode);
    console.log('----------------------------------------\n');

    // Step 3: Send the Manim code to the rendering API
    console.log('[Video Generation] Step 3: Sending code to rendering API...');
    const renderingResponse = await fetch("https://your-manim-render-api.com/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `${topic.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        code: manimCode
      }),
    });

    if (!renderingResponse.ok) {
      console.error('[Video Generation] Error: Rendering API request failed');
      throw new Error("Failed to render video");
    }

    // Step 4: Get the video URL from the response
    console.log('[Video Generation] Step 4: Processing API response...');
    const { status, video_url } = await renderingResponse.json();
    console.log(`[Video Generation] Response status: ${status}`);
    console.log(`[Video Generation] Video URL: ${video_url}`);

    // Check if the video was generated successfully
    if (status !== "success" || !video_url) {
      console.error('[Video Generation] Error: Video generation failed');
      throw new Error("Video generation failed");
    }

    // Remove the @ symbol if it exists at the start of the URL
    const cleanVideoUrl = video_url.startsWith('@') ? video_url.substring(1) : video_url;
    console.log('[Video Generation] Process completed successfully');

    return {
      videoScript,
      manimCode,
      videoUrl: cleanVideoUrl,
      status
    };
  } catch (error) {
    console.error("[Video Generation] Error in video generation pipeline:", error);
    throw error;
  }
}

export default openai; 