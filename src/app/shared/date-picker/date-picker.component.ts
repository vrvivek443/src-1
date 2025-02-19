import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit, SimpleChanges } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements AfterViewInit {

  @Input() selectedDateRange: any = {};
  @Output() selectedDateRangeChange = new EventEmitter<any>();
  @Input() uniqueId: string = '';  

  selectedRange: string = 'CUSTOM';
  dropdownItems: any[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDateRange'] && this.selectedDateRange) {
      if (this.selectedDateRange.dateType) {
        this.selectedRange = this.selectedDateRange.dateType; // Set dropdown selection
        this.updateButtonText();
      }
    }
  }

  ngAfterViewInit(): void {
    this.updateButtonText();

    // Initialize daterangepicker
    jQuery(`#Date_s_${this.uniqueId}`).daterangepicker({
      autoUpdateInput: false,
      locale: {
        format: 'YYYY-MM-DD',
        cancelLabel: 'Clear',
      },
      opens: 'center'
    });

    // Apply or cancel actions for the daterangepicker
    jQuery(`#Date_s_${this.uniqueId}`).on('apply.daterangepicker', (ev: any, picker: any) => {
      const dateObject = {
        dateType: 'CUSTOM',
        startDate: picker.startDate.format('YYYY-MM-DD'),
        endDate: picker.endDate.format('YYYY-MM-DD'),
      };

      this.selectedDateRangeChange.emit(dateObject);
      this.selectedDateRange = `${picker.startDate.format('YYYY-MM-DD')} to ${picker.endDate.format('YYYY-MM-DD')}`;
      jQuery(`#Date_s_${this.uniqueId}`).val(this.selectedDateRange).trigger('change');
    });

    jQuery(`#Date_s_${this.uniqueId}`).on('cancel.daterangepicker', (event: any, picker: any) => {
      const dateObject = {
        dateType: 'NONE',
        startDate: '',
        endDate: '',
      };
    
      this.selectedDateRangeChange.emit(dateObject);
      this.selectedDateRange = '';
      
      jQuery(`#Date_s_${this.uniqueId}`).val('').trigger('change');
    
      picker.setStartDate(new Date()); 
      picker.setEndDate(new Date());
    });
    
  }

  setDateRange(range: string): void {
    this.selectedRange = range;
    this.updateButtonText();

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    const today = new Date();
    let dateObject = {
      dateType: range,
      startDate: startDate,
      endDate: endDate
    };

    switch (range) {
      case 'TODAY':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        dateObject.startDate = null;
        dateObject.endDate = null;
        break;
      case 'YESTERDAY':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        dateObject.startDate = null;
        dateObject.endDate = null;
        break;
      case 'THISWEEK':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        dateObject.startDate = null;
        dateObject.endDate = null;
        break;
      case 'THISMONTH':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        dateObject.startDate = null;
        dateObject.endDate = null;
        break;
      case 'CUSTOM':
        jQuery(`#Date_s_${this.uniqueId}`).val('').trigger('change');
        return;
      default:
        return;
    }

    this.selectedDateRangeChange.emit(dateObject);

    // Manually update the input field for display
    if (startDate && endDate) {
      this.selectedDateRange = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
    } else {
      this.selectedDateRange = `${this.formatDate(startDate)}`;
    }

    jQuery(`#Date_s_${this.uniqueId}`).val(this.selectedDateRange).trigger('change');
  }

  formatDate(date: Date | null): string {
    if (date) {
      return date.toLocaleDateString('en-GB');
    }
    return '';
  }

  updateButtonText(): void {
    let button = jQuery(`#Date_s_${this.uniqueId}`).siblings('.btn.dropdown-toggle');
    let dropdownItems = jQuery(`#Date_s_${this.uniqueId}`).siblings('.dropdown-menu').find('.dropdown-item');

    dropdownItems.removeClass('active');

    dropdownItems.each((index: any, item: any) => {
      if (jQuery(item).text().trim().toLowerCase().replace(/\s+/g, '') === this.getRangeLabel(this.selectedRange).toLowerCase()) {
        jQuery(item).addClass('active');
      }
    });
  }

  getRangeLabel(range: string): string {
    switch (range) {
      case 'TODAY':
        return 'Today';
      case 'YESTERDAY':
        return 'Yesterday';
      case 'THISWEEK':
        return 'This Week';
      case 'THISMONTH':
        return 'This Month';
      case 'CUSTOM':
        return 'Custom';
      default:
        return 'Custom';
    }
  }

}
