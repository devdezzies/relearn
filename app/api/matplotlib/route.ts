import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // In a production environment, this would:
    // 1. Execute the Python code in a secure sandbox
    // 2. Save the generated matplotlib figure as an image
    // 3. Upload the image to a storage service
    // 4. Return the URL to the image

    // For this demo, we'll return a placeholder image URL
    // based on the type of plot detected in the code
    
    let imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_pyplot_001.png"; // Default image
    
    // Determine the type of plot based on the code content
    if (code.includes('plt.bar') || code.includes('barplot')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_bar_label_demo_00_00.png";
    } else if (code.includes('plt.scatter') || code.includes('scatterplot')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_scatter_demo2_001.png";
    } else if (code.includes('plt.hist') || code.includes('histogram')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_histogram_features_001.png";
    } else if (code.includes('plt.pie') || code.includes('pie chart')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_pie_features_001.png";
    } else if (code.includes('plt.boxplot') || code.includes('boxplot')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_boxplot_demo_001.png";
    } else if (code.includes('heatmap') || code.includes('plt.imshow')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_image_annotated_heatmap_001.png";
    } else if (code.includes('plt.plot') && code.includes('sin')) {
      imageUrl = "https://matplotlib.org/stable/_images/sphx_glr_pyplot_scales_001.png";
    }
    
    // Add a random query parameter to prevent caching
    imageUrl += `?t=${Date.now()}`;
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error processing matplotlib code:', error);
    return NextResponse.json(
      { error: 'Failed to process matplotlib code' },
      { status: 500 }
    );
  }
}