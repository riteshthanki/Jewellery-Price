<?php
$jsonFile = 'data.json';
$data = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];
$rates = $data['rates'] ?? [];
$mediaItems = $data['media'] ?? [];

function formatCurrency($amount, $currency = 'INR') {
    return '₹' . number_format($amount, 2);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jay Mataji Jewellers</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              serif: ['Merriweather', 'serif'],
              sans: ['Inter', 'sans-serif'],
            },
            colors: {
              gold: {
                400: '#FFD700',
                500: '#F59E0B',
                600: '#D97706',
                700: '#B45309',
              },
              silver: {
                400: '#9CA3AF',
                500: '#6B7280',
              }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: #000000;
        color: white;
      }
      /* Hide scrollbar for clean modal */
      .no-scrollbar::-webkit-scrollbar {
          display: none;
      }
      .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
      }
    </style>
</head>
<body class="min-h-screen bg-black font-sans relative">

    <div class="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24">
        
        <!-- Header Section -->
        <div class="w-full flex flex-col items-center justify-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200 tracking-widest uppercase mb-4 text-center drop-shadow-sm" style="background-clip: text; -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #fde68a, #eab308, #fde68a);">
                Jay Mataji Jewellers
            </h1>
            <div class="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-4 opacity-50"></div>
            <p id="clock" class="text-slate-300 font-sans font-medium text-lg md:text-xl tracking-wide opacity-90">
                Loading date...
            </p>
        </div>

        <!-- Main Grid for Rates -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <?php foreach ($rates as $rate): 
                $circleStyle = ($rate['metal'] === 'Gold') 
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] text-black' 
                    : 'bg-gradient-to-br from-slate-300 to-slate-500 shadow-[0_0_20px_rgba(148,163,184,0.4)] text-black';
            ?>
            <div class="relative group h-full">
                <div class="absolute -inset-0.5 bg-gradient-to-b from-slate-700 to-slate-900 rounded-2xl opacity-50 group-hover:opacity-75 blur transition duration-500"></div>
                <div class="relative bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center h-full transition-transform duration-300 hover:scale-[1.02]">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-3 <?= $circleStyle ?>">
                        <?= $rate['purityLabel'] ?>
                    </div>
                    <div class="text-slate-400 font-medium text-sm tracking-widest uppercase mb-8">
                        <?= $rate['purityPercentage'] ?> Pure
                    </div>
                    <div class="w-full text-center">
                        <span class="text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg block font-sans">
                            <?= formatCurrency($rate['price']) ?>
                        </span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- Media Carousel Section -->
        <div class="w-full max-w-6xl mx-auto mt-8 relative group">
            <div id="carousel-container" class="relative overflow-hidden rounded-2xl shadow-2xl bg-slate-900 aspect-video md:aspect-[21/9]">
                <?php if (empty($mediaItems)): ?>
                    <div class="flex items-center justify-center w-full h-full">
                        <p class="text-slate-500 font-serif text-lg">No media available.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($mediaItems as $index => $item): ?>
                        <div class="carousel-slide absolute inset-0 transition-opacity duration-1000 ease-in-out <?= $index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0' ?>" data-index="<?= $index ?>">
                            <?php if ($item['type'] === 'image'): ?>
                                <img src="<?= $item['url'] ?>" alt="<?= htmlspecialchars($item['title'] ?? '') ?>" class="w-full h-full object-cover">
                            <?php else: ?>
                                <video src="<?= $item['url'] ?>" autoplay muted loop playsinline class="w-full h-full object-cover"></video>
                            <?php endif; ?>
                            
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-8 md:pb-12">
                                <?php if (!empty($item['title'])): ?>
                                    <h3 class="text-white text-2xl md:text-4xl font-serif font-bold tracking-wider drop-shadow-lg">
                                        <?= htmlspecialchars($item['title']) ?>
                                    </h3>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                    
                    <!-- Indicators -->
                    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                        <?php foreach ($mediaItems as $index => $item): ?>
                            <button onclick="goToSlide(<?= $index ?>)" class="indicator-dot w-2.5 h-2.5 rounded-full transition-all duration-300 <?= $index === 0 ? 'bg-amber-500 w-8' : 'bg-white/50 hover:bg-white/80' ?>"></button>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Floating Admin Buttons -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button onclick="toggleModal('mediaModal')" class="bg-white text-slate-600 hover:text-amber-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-slate-200 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </button>
        <button onclick="toggleModal('ratesModal')" class="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-amber-500 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
        </button>
    </div>

    <!-- Rate Update Modal -->
    <div id="ratesModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="bg-slate-800 px-6 py-4 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white font-serif">Update Daily Rates</h3>
                <button onclick="toggleModal('ratesModal')" class="text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <form id="ratesForm" class="p-6 max-h-[70vh] overflow-y-auto">
                <div class="space-y-4">
                    <?php foreach ($rates as $index => $rate): ?>
                    <div class="flex flex-col">
                        <label class="text-sm font-semibold text-slate-700 mb-1 flex justify-between">
                            <span><?= $rate['metal'] ?> <span class="<?= $rate['metal'] === 'Gold' ? 'text-amber-600' : 'text-slate-500' ?>"><?= $rate['purityLabel'] ?></span></span>
                            <span class="text-slate-400 font-normal text-xs uppercase tracking-wide"><?= $rate['unit'] ?></span>
                        </label>
                        <div class="relative group">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">₹</span>
                            <input type="hidden" name="rates[<?= $index ?>][id]" value="<?= $rate['id'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][metal]" value="<?= $rate['metal'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][purityLabel]" value="<?= $rate['purityLabel'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][purityPercentage]" value="<?= $rate['purityPercentage'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][currency]" value="<?= $rate['currency'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][unit]" value="<?= $rate['unit'] ?>">
                            <input type="hidden" name="rates[<?= $index ?>][colorClass]" value="<?= $rate['colorClass'] ?>">
                            <input type="number" name="rates[<?= $index ?>][price]" value="<?= $rate['price'] ?>" class="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono text-lg text-slate-800" placeholder="0.00" step="0.01">
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="mt-8 flex gap-3">
                    <button type="button" onclick="toggleModal('ratesModal')" class="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                    <button type="submit" class="flex-1 px-4 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Media Management Modal -->
    <div id="mediaModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <div class="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
                <h3 class="text-xl font-bold text-white font-serif">Manage Gallery</h3>
                <button onclick="toggleModal('mediaModal')" class="text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto flex-grow bg-slate-50">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <p class="text-slate-600">Drag items to reorder. Add photos and videos to the main display carousel.</p>
                    <div class="flex flex-wrap gap-2">
                        <input type="file" id="mediaInput" accept="image/*,video/*" multiple class="hidden" onchange="uploadFiles(this.files)">
                        <button onclick="document.getElementById('mediaInput').click()" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm bg-amber-600 hover:bg-amber-700 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Upload Media
                        </button>
                    </div>
                </div>

                <!-- Grid -->
                <div id="mediaGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <?php foreach ($mediaItems as $index => $item): ?>
                    <div class="draggable-item relative group aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-move transition-all duration-200 hover:shadow-md" 
                         draggable="true" 
                         data-id="<?= $item['id'] ?>"
                         data-type="<?= $item['type'] ?>"
                         data-url="<?= $item['url'] ?>"
                         data-title="<?= $item['title'] ?? '' ?>">
                        
                        <?php if ($item['type'] === 'image'): ?>
                            <img src="<?= $item['url'] ?>" class="w-full h-full object-cover pointer-events-none">
                        <?php else: ?>
                            <div class="w-full h-full relative bg-black">
                                <video src="<?= $item['url'] ?>" class="w-full h-full object-cover opacity-80 pointer-events-none" muted></video>
                                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                   <div class="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                                   </div>
                                </div>
                            </div>
                        <?php endif; ?>

                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                            <button onclick="deleteMedia('<?= $item['id'] ?>')" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-all shadow-lg cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <div class="p-4 bg-white border-t border-slate-200 flex justify-end">
               <button onclick="toggleModal('mediaModal')" class="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Close</button>
            </div>
        </div>
    </div>

    <!-- JavaScript Logic -->
    <script>
        // --- Clock Logic ---
        function updateClock() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' });
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            document.getElementById('clock').innerText = `${dateStr} at ${hours}:${minutes} ${ampm}`;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // --- Carousel Logic ---
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.indicator-dot');
        const totalSlides = slides.length;

        function goToSlide(index) {
            if(totalSlides === 0) return;
            
            // Remove active state
            slides.forEach(slide => {
                slide.classList.remove('opacity-100', 'z-10');
                slide.classList.add('opacity-0', 'z-0');
            });
            dots.forEach(dot => {
                dot.classList.remove('bg-amber-500', 'w-8');
                dot.classList.add('bg-white/50');
            });

            // Set new active state
            currentSlide = index;
            if(slides[currentSlide]) {
                slides[currentSlide].classList.remove('opacity-0', 'z-0');
                slides[currentSlide].classList.add('opacity-100', 'z-10');
            }
            if(dots[currentSlide]) {
                dots[currentSlide].classList.remove('bg-white/50');
                dots[currentSlide].classList.add('bg-amber-500', 'w-8');
            }
        }

        if(totalSlides > 1) {
            setInterval(() => {
                goToSlide((currentSlide + 1) % totalSlides);
            }, 5000);
        }

        // --- Modal Logic ---
        function toggleModal(id) {
            const modal = document.getElementById(id);
            if (modal.classList.contains('hidden')) {
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }

        // --- Drag & Drop Reordering ---
        const grid = document.getElementById('mediaGrid');
        let draggedItem = null;

        // Add event listeners to initial items
        document.querySelectorAll('.draggable-item').forEach(addDragListeners);

        function addDragListeners(item) {
            item.addEventListener('dragstart', function(e) {
                draggedItem = this;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => this.style.opacity = '0.5', 0);
            });
            
            item.addEventListener('dragend', function(e) {
                this.style.opacity = '1';
                draggedItem = null;
                saveReorder();
            });
            
            item.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            
            item.addEventListener('drop', function(e) {
                e.preventDefault();
                if (this !== draggedItem) {
                    let allItems = [...grid.children];
                    let currIndex = allItems.indexOf(draggedItem);
                    let targetIndex = allItems.indexOf(this);
                    
                    if (currIndex < targetIndex) {
                        this.after(draggedItem);
                    } else {
                        this.before(draggedItem);
                    }
                }
            });
        }

        function saveReorder() {
            const items = [];
            document.querySelectorAll('.draggable-item').forEach(el => {
                items.push({
                    id: el.dataset.id,
                    type: el.dataset.type,
                    url: el.dataset.url,
                    title: el.dataset.title
                });
            });

            const formData = new FormData();
            formData.append('action', 'reorder_media');
            formData.append('media', JSON.stringify(items));

            fetch('api.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if(!data.success) alert('Failed to save order');
                    // Optional: reload page to update main carousel
                });
        }

        // --- API Interactions ---

        // Update Rates
        document.getElementById('ratesForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            // Convert indexed form data to array of objects
            const rates = [];
            // Simple parsing since we know structure: rates[0][id], etc
            const formObj = {};
            formData.forEach((value, key) => {
                // regex to parse rates[index][key]
                const match = key.match(/rates\[(\d+)\]\[(\w+)\]/);
                if(match) {
                    const idx = match[1];
                    const prop = match[2];
                    if(!rates[idx]) rates[idx] = {};
                    rates[idx][prop] = value;
                }
            });

            const apiData = new FormData();
            apiData.append('action', 'update_rates');
            apiData.append('rates', JSON.stringify(rates));

            fetch('api.php', { method: 'POST', body: apiData })
                .then(res => res.json())
                .then(data => {
                    if(data.success) location.reload();
                    else alert('Error updating rates');
                });
        });

        // Upload Media
        function uploadFiles(files) {
            if(files.length === 0) return;
            const formData = new FormData();
            formData.append('action', 'upload_media');
            for(let i=0; i<files.length; i++) {
                formData.append('files[]', files[i]);
            }

            fetch('api.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if(data.success) location.reload();
                    else alert('Error uploading');
                });
        }

        // Delete Media
        function deleteMedia(id) {
            if(!confirm('Are you sure?')) return;
            const formData = new FormData();
            formData.append('action', 'delete_media');
            formData.append('id', id);

            fetch('api.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if(data.success) location.reload();
                    else alert('Error deleting');
                });
        }
    </script>
</body>
</html>