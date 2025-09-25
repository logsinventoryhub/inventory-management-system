import { Component, OnInit } from '@angular/core';
import { CommunicatorService } from '../communicator.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ThemeService } from '../theme.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, RouterModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
})
export class ProductGalleryComponent implements OnInit {
  cookieValue: string;
  products: any[] = [];
  business: any;
  businessId: any;
  categories: string[] = [];
  selectedCategory: string = 'All';
  isDarkMode = false;

  toggleTheme(event: Event) {
    this.isDarkMode = (event.target as HTMLInputElement).checked;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('dark-mode', this.isDarkMode ? 'true' : 'false');
  }

  constructor(
    private communicatorService: CommunicatorService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /*toggleTheme(event: any) {
    const enabled = event.target.checked;
    this.themeService.toggleDarkMode(enabled);
  }*/

  addToCart(product: any) {
    const discount = Number(product.discount_price);
    const original = Number(product.price);

    const effectivePrice = discount && discount > 0 ? discount : original;

    const cartItem = {
      ...product,
      price: effectivePrice,
      quantity: 1,
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Product added to cart!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Out Of Stock',
          text:
            err.message ||
            'This product is out of stock or quantity exceeds available stock.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('business');
    this.business = name;
    this.businessId = id;

    if (isPlatformBrowser(this.platformId)) {
      const darkPref = localStorage.getItem('dark-mode');
      this.isDarkMode = darkPref === 'true';
      document.body.classList.toggle('dark-theme', this.isDarkMode);
    }

    const fetchGalleryProductsData = {
      business_id: id,
      key: 'GET_GALLERY_PRODUCTS',
    };

    this.spinner.show();
    this.communicatorService
      .onSubmitService(fetchGalleryProductsData)
      .subscribe({
        next: (res) => {
          this.products = res.message || [];
          this.extractCategories();
          this.spinner.hide();
        },
        error: (err) => {
          console.error(err);
          this.spinner.hide();
        },
      });
  }

  scrollToProducts(): void {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  extractCategories(): void {
    const unique = new Set<string>();
    this.products.forEach((p) => {
      if (p.category_name) unique.add(p.category_name);
    });
    this.categories = [...Array.from(unique)];
  }

  getProductsByCategory(category: string) {
    return this.products.filter((p) => p.category_name === category);
  }

  // Optional helper to format IDs (for Bootstrap compatibility)
  formatId(category: string): string {
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  currentYear = new Date().getFullYear();
}
