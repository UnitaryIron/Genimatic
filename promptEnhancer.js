document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("promptInput");
    const button = document.getElementById("enhanceBtn");
  
    if (button && input) {
      button.addEventListener("click", () => {
        const userPrompt = input.value;
        input.value = enhancePrompt(userPrompt);
      });
    }
  });
  

function enhancePrompt(prompt) {
    if (!prompt || typeof prompt !== "string") return "";

    const lowerPrompt = prompt.toLowerCase().trim();
    let enhancedPrompt = prompt;

    const scenarios = [
        { match: /portrait/, enhance: p => `${p}, ultra-detailed facial features, natural skin texture, soft studio lighting, 85mm lens effect, cinematic color grading` },
        { match: /landscape/, enhance: p => `${p}, epic wide-angle view, cinematic lighting, hyper-realistic textures, golden hour ambience, panoramic depth` },
        { match: /cyberpunk/, enhance: p => `${p}, neon-lit streets, rainy reflections, bustling futuristic city, cinematic depth of field, holographic billboards` },
        { match: /fantasy/, enhance: p => `${p}, magical atmosphere, glowing elements, mythical creatures in the background, vivid color grading, enchanted forests` },
        { match: /anime/, enhance: p => `${p}, vibrant anime-style shading, soft gradients, expressive eyes, Studio Ghibli atmosphere, high-contrast cel shading` },
        { match: /sci-?fi/, enhance: p => `${p}, futuristic architecture, glowing holograms, space-inspired lighting, high-tech ambience, interstellar backdrops` },
        { match: /food/, enhance: p => `${p}, ultra-detailed textures, appetizing lighting, professional food photography composition, mouth-watering colors` },
        { match: /car/, enhance: p => `${p}, ultra-sharp focus, cinematic reflections, high-octane motion blur, luxury photography style, metallic gleam` },
        { match: /space/, enhance: p => `${p}, deep cosmic background, glowing stars, nebula clouds, high-contrast galaxy colors, interplanetary scale` },
        { match: /animal/, enhance: p => `${p}, realistic fur texture, natural lighting, in-motion wildlife capture, ultra-detailed eyes, lifelike anatomy` },
        { match: /fashion/, enhance: p => `${p}, runway glamour lighting, intricate clothing textures, luxury aesthetic, editorial photography style` },
        { match: /city/, enhance: p => `${p}, skyline shot, ambient lighting, cinematic bokeh, atmospheric fog, bustling urban energy` },
        { match: /interior/, enhance: p => `${p}, warm cozy lighting, soft shadows, high-end interior design photography, elegant composition` },
        { match: /horror/, enhance: p => `${p}, eerie shadows, foggy atmosphere, unsettling color tones, cinematic tension, creepy silhouette effects` },
        { match: /nature/, enhance: p => `${p}, lush greenery, crystal-clear water, high-dynamic-range photography, serene atmosphere` },
        { match: /sports/, enhance: p => `${p}, motion capture, ultra-sharp details, adrenaline-filled moment, pro sports photography, stadium lighting` },
        { match: /macro/, enhance: p => `${p}, extreme close-up, intricate details, perfect focus stacking, micro-world perspective` },
        { match: /architecture/, enhance: p => `${p}, symmetrical perspective, professional architectural photography, soft daylight, intricate geometry` },
        { match: /war/, enhance: p => `${p}, cinematic chaos, dramatic lighting, intense emotional expressions, battlefield atmosphere` },
        { match: /robot/, enhance: p => `${p}, high-tech mechanical details, futuristic glow, photorealistic metal textures, advanced robotics design` },
        { match: /underwater/, enhance: p => `${p}, deep ocean lighting, floating particles, magical marine life, ethereal water glow` },
        { match: /steampunk/, enhance: p => `${p}, brass gears, vintage technology, steam-filled atmosphere, Victorian aesthetic` },
        { match: /vintage/, enhance: p => `${p}, sepia tones, film grain, classic photography style, timeless look` },
        { match: /abstract/, enhance: p => `${p}, bold color shapes, surreal design patterns, dreamlike composition, visual experimentation` },
        { match: /game/, enhance: p => `${p}, ultra-HD textures, cinematic action scene, dramatic lighting effects, immersive 3D perspective` },
        { match: /dance/, enhance: p => `${p}, motion blur elegance, spotlight focus, dynamic movement capture, performance energy` },
        { match: /ocean/, enhance: p => `${p}, crystal-clear turquoise waters, sunlight rays underwater, serene horizon` },
        { match: /forest/, enhance: p => `${p}, dense foliage, misty background, cinematic wildlife presence, magical lighting` },
        { match: /desert/, enhance: p => `${p}, golden sands, heat shimmer effect, dramatic shadows, wide-angle view` },
        { match: /mountain/, enhance: p => `${p}, towering peaks, snow-capped summits, atmospheric clouds, epic scale` },
        { match: /sky/, enhance: p => `${p}, vibrant clouds, painterly sunset colors, dynamic atmospheric depth` },
        { match: /storm/, enhance: p => `${p}, dramatic lightning strikes, moody skies, cinematic rain effects` },
        { match: /fire/, enhance: p => `${p}, glowing embers, warm orange highlights, intense heat haze` },
        { match: /waterfall/, enhance: p => `${p}, cascading water motion blur, mist-filled surroundings, lush nature` },
        { match: /island/, enhance: p => `${p}, tropical palms, bright turquoise shallows, cinematic paradise view` },
        { match: /market/, enhance: p => `${p}, bustling stalls, rich cultural colors, authentic street life` },
        { match: /temple/, enhance: p => `${p}, intricate carvings, sacred atmosphere, golden sunlight filtering` },
        { match: /castle/, enhance: p => `${p}, medieval fortress walls, dramatic clouds, majestic silhouette` },
        { match: /train/, enhance: p => `${p}, motion blur speed, atmospheric travel vibes, cinematic lighting` },
        { match: /bridge/, enhance: p => `${p}, architectural marvel, dramatic perspective, skyline framing` },
        { match: /boat/, enhance: p => `${p}, reflective water, serene horizon, cinematic voyage style` },
        { match: /snow/, enhance: p => `${p}, soft powdery snow, frosty air haze, serene winter landscape` },
        { match: /rain/, enhance: p => `${p}, reflective puddles, atmospheric raindrops, moody lighting` },
        { match: /flower/, enhance: p => `${p}, macro petal textures, vibrant natural colors, botanical elegance` },
        { match: /night/, enhance: p => `${p}, deep shadows, glowing lights, cinematic noir tone` },
        { match: /sunset/, enhance: p => `${p}, golden orange glow, dramatic silhouette contrasts, cinematic horizon` },
        { match: /sunrise/, enhance: p => `${p}, soft pastel gradients, fresh morning light, serene atmosphere` },
        { match: /celebration/, enhance: p => `${p}, fireworks burst, glowing lanterns, vibrant party atmosphere` },
        { match: /rainforest/, enhance: p => `${p}, dense jungle foliage, exotic wildlife, misty atmosphere, vibrant greens` },
        { match: /robotic/, enhance: p => `${p}, polished metallic surfaces, glowing LED eyes, futuristic machinery details` },
        { match: /medieval/, enhance: p => `${p}, stone castles, armored knights, torchlit halls, historical accuracy` },
        { match: /post-apocalyptic/, enhance: p => `${p}, desolate landscapes, ruined cities, gritty textures, moody skies` },
        { match: /cybernetic/, enhance: p => `${p}, biomechanical fusion, glowing circuitry, futuristic enhancements` },
        { match: /angelic/, enhance: p => `${p}, divine glow, ethereal wings, celestial light rays` },
        { match: /demonic/, enhance: p => `${p}, dark shadows, fiery eyes, infernal flames, menacing presence` },
        { match: /steampunk-fantasy/, enhance: p => `${p}, brass machinery, enchanted gadgets, Victorian fantasy elements` },
        { match: /surreal/, enhance: p => `${p}, dreamlike distortions, impossible landscapes, vivid color explosions` },
        { match: /underwater-city/, enhance: p => `${p}, bioluminescent structures, aquatic life, shimmering water effects` },
        { match: /gothic/, enhance: p => `${p}, dark stone architecture, stained glass, moody chiaroscuro lighting` },
        { match: /baroque/, enhance: p => `${p}, ornate decorations, dramatic contrasts, classical elegance` },
        { match: /minimalist/, enhance: p => `${p}, clean lines, muted palette, negative space emphasis` },
        { match: /pixel-art/, enhance: p => `${p}, retro pixelated style, 8-bit colors, charming simplicity` },
        { match: /comic-book/, enhance: p => `${p}, bold outlines, halftone shading, dynamic action poses` },
        { match: /watercolor/, enhance: p => `${p}, soft pastel washes, bleeding edges, delicate brush strokes` },
        { match: /graffiti/, enhance: p => `${p}, vibrant spray paint textures, urban wall art style, bold colors` },
        { match: /retro-futuristic/, enhance: p => `${p}, neon grids, synthwave colors, vintage sci-fi vibes` },
        { match: /celestial/, enhance: p => `${p}, starry backgrounds, glowing constellations, cosmic dust` },
        { match: /ethereal/, enhance: p => `${p}, soft glowing aura, translucent forms, dreamlike quality` },
        { match: /high-tech/, enhance: p => `${p}, sleek design, holographic interfaces, futuristic materials` },
        { match: /biomechanical/, enhance: p => `${p}, organic-mechanical fusion, sinewy cables, chrome plating` },
        { match: /dystopian/, enhance: p => `${p}, bleak urban decay, oppressive atmosphere, harsh lighting` },
        { match: /vaporwave/, enhance: p => `${p}, pastel neon colors, retro computer graphics, nostalgic aesthetic` },
        { match: /fantasy-creature/, enhance: p => `${p}, intricate scales, glowing eyes, mythical anatomy, magical aura` },
        { match: /cybernetic-animal/, enhance: p => `${p}, robotic limbs, LED accents, futuristic bioengineering` },
        { match: /space-station/, enhance: p => `${p}, metallic corridors, starry windows, futuristic control panels` },
        { match: /magic/, enhance: p => `${p}, sparkling particles, glowing runes, mystical energy bursts` },
        { match: /glitch-art/, enhance: p => `${p}, pixel distortion, color channel shifts, digital noise` },
        { match: /post-modern/, enhance: p => `${p}, abstract shapes, bold contrasts, eclectic visual elements` },
        { match: /pop-art/, enhance: p => `${p}, bright primary colors, comic style dots, bold outlines` },
        { match: /viking/, enhance: p => `${p}, rugged armor, Nordic runes, stormy seas` },
        { match: /samurai/, enhance: p => `${p}, traditional armor, cherry blossoms, dramatic stances` },
        { match: /futuristic-vehicle/, enhance: p => `${p}, aerodynamic shapes, glowing accents, hyper-modern design` },
        { match: /cybernetic-portrait/, enhance: p => `${p}, half-human half-machine, glowing implants, futuristic interface overlay` },
        { match: /alien-planet/, enhance: p => `${p}, strange flora, unusual sky colors, surreal terrain` },
        { match: /medieval-battle/, enhance: p => `${p}, clashing swords, flying banners, intense expressions` },
        { match: /mythological/, enhance: p => `${p}, legendary beasts, divine light, ancient symbols` },
        { match: /post-apocalyptic-city/, enhance: p => `${p}, crumbling skyscrapers, overgrown nature, smoky skies` },
        { match: /fairy-tale/, enhance: p => `${p}, whimsical cottages, enchanted forests, soft glowing light` },
        { match: /robot-battle/, enhance: p => `${p}, sparks flying, metallic debris, dynamic action` },
        { match: /virtual-reality/, enhance: p => `${p}, wireframe grids, glowing HUD elements, digital immersion` },
        { match: /time-travel/, enhance: p => `${p}, temporal distortions, swirling clocks, fragmented reality` },
        { match: /neo-noir/, enhance: p => `${p}, dark alleyways, neon reflections, moody shadows` },
        { match: /ancient-ruins/, enhance: p => `${p}, crumbling stones, creeping vines, mysterious glyphs` },
        { match: /space-battle/, enhance: p => `${p}, laser fire, starship formations, cosmic explosions` },
        { match: /underwater-ruins/, enhance: p => `${p}, submerged temples, aquatic life, dappled sunlight through water` },
        { match: /ghostly/, enhance: p => `${p}, translucent figures, eerie glow, misty backgrounds` },
        { match: /retro-gaming/, enhance: p => `${p}, pixel sprites, vintage arcade colors, nostalgic vibes` },
        { match: /tribal/, enhance: p => `${p}, intricate patterns, earthy tones, traditional attire` },
        { match: /carnival/, enhance: p => `${p}, bright lights, festive crowds, playful colors` },
        { match: /space-colony/, enhance: p => `${p}, futuristic domes, alien landscapes, advanced technology` },
        { match: /deep-sea/, enhance: p => `${p}, bioluminescent creatures, dark waters, mysterious shadows` },
        { match: /industrial/, enhance: p => `${p}, heavy machinery, rusty metal, harsh lighting` },
        { match: /romantic/, enhance: p => `${p}, soft lighting, warm color palette, intimate atmosphere` },
        { match: /epic/, enhance: p => `${p}, grand scale, dynamic composition, heroic poses` },
        { match: /dark-fantasy/, enhance: p => `${p}, twisted creatures, gloomy forests, ominous skies` },
        { match: /medieval-fantasy/, enhance: p => `${p}, enchanted armor, mystical forests, magical glow` },
        { match: /high-fantasy/, enhance: p => `${p}, elaborate castles, majestic creatures, vibrant magic` },
        { match: /futuristic-sports/, enhance: p => `${p}, high-speed motion, neon-lit arenas, cutting-edge gear` },
        { match: /space-exploration/, enhance: p => `${p}, starships, alien planets, cosmic vistas` },
        { match: /art-deco/, enhance: p => `${p}, geometric patterns, metallic finishes, 1920s glamour` },
        { match: /fantasy-city/, enhance: p => `${p}, towering spires, magical glow, bustling markets` },
        { match: /dreamscape/, enhance: p => `${p}, surreal environments, floating islands, soft colors` },
        { match: /medieval-architecture/, enhance: p => `${p}, stone arches, stained glass, vaulted ceilings` },
        { match: /space-robot/, enhance: p => `${p}, sleek metallic design, glowing eyes, futuristic weaponry` },
        { match: /noir-portrait/, enhance: p => `${p}, high contrast lighting, moody expression, cigarette smoke` }
      ];

    scenarios.forEach(s => {
        if (s.match.test(lowerPrompt)) {
            enhancedPrompt = s.enhance(enhancedPrompt);
        }
    });

    enhancedPrompt += ", ultra-realistic, 8K resolution, trending on ArtStation, masterful composition";

    return enhancedPrompt;
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("promptInput");
    const output = document.getElementById("enhancedOutput");
    const button = document.getElementById("enhanceBtn");

    if (button && input && output) {
        button.addEventListener("click", () => {
            const userPrompt = input.value;
            output.value = enhancePrompt(userPrompt);
        });
    }
});
